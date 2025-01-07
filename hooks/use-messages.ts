import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Message } from '@/types/messages';
import { pusherClient } from '@/lib/pusher';

export function useMessages(channelId: string) {
  const queryClient = useQueryClient();
  const lastSentMessage = useRef<{ text: string; timestamp: number } | null>(null);
  const isSending = useRef(false);

  // Fetch messages
  const { data: messages = [], isLoading, error, refetch } = useQuery({
    queryKey: ['messages', channelId],
    queryFn: async () => {
      const response = await fetch(`/api/messages?channelId=${channelId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      return response.json();
    },
  });

  // Reset state when channel changes
  useEffect(() => {
    lastSentMessage.current = null;
    isSending.current = false;
    
    return () => {
      lastSentMessage.current = null;
      isSending.current = false;
    };
  }, [channelId]);

  // Send message mutation
  const { mutateAsync: sendMessage } = useMutation({
    mutationFn: async (message: { text: string; fileUrl?: string }) => {
      if (!message.text.trim() && !message.fileUrl) {
        throw new Error('Message is empty');
      }

      // Prevent concurrent sends
      if (isSending.current) {
        throw new Error('Message send in progress');
      }

      // Prevent duplicate messages within 2 seconds
      if (lastSentMessage.current && 
          lastSentMessage.current.text === message.text && 
          Date.now() - lastSentMessage.current.timestamp < 2000) {
        throw new Error('Duplicate message');
      }

      try {
        isSending.current = true;
        lastSentMessage.current = {
          text: message.text,
          timestamp: Date.now()
        };

        const response = await fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: message.text,
            fileUrl: message.fileUrl,
            channelId,
          }),
        });

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`Failed to send message: ${response.status} ${errorData}`);
        }

        return response.json();
      } finally {
        isSending.current = false;
      }
    },
  });

  // Update reactions mutation
  const { mutateAsync: updateReactions } = useMutation({
    mutationFn: async (params: { messageId: string, reactions: Message['reactions'] }) => {
      const response = await fetch(`/api/messages/${params.messageId}/reactions`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reactions: params.reactions }),
      });

      if (!response.ok) {
        throw new Error('Failed to update reactions');
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['messages', channelId], (oldMessages: Message[] = []) =>
        oldMessages.map(message =>
          message.id === variables.messageId
            ? { ...message, reactions: data.reactions }
            : message
        )
      );
    },
  });

  // Subscribe to real-time updates
  useEffect(() => {
    if (!channelId) return;

    try {
      // Get the actual channel ID from the server first
      fetch(`/api/channels/resolve?channelId=${channelId}`)
        .then(res => res.json())
        .then(channel => {
          if (!channel?.id) {
            console.error('Could not resolve channel ID');
            return;
          }

          const pusherChannel = pusherClient.subscribe(channel.id);

          pusherChannel.bind('new-message', (newMessage: Message) => {
            queryClient.setQueryData(['messages', channelId], (oldMessages: Message[] = []) => [
              ...oldMessages,
              newMessage,
            ]);
          });

          return () => {
            pusherChannel.unbind('new-message');
            pusherClient.unsubscribe(channel.id);
          };
        })
        .catch(error => {
          console.error('Error resolving channel ID:', error);
        });
    } catch (error) {
      console.error('Pusher subscription error:', error);
    }
  }, [channelId, queryClient]);

  return {
    messages,
    loading: isLoading,
    error,
    sendMessage,
    refreshMessages: refetch,
    updateReactions: (messageId: string, reactions: Message['reactions']) => 
      updateReactions({ messageId, reactions }),
  };
} 
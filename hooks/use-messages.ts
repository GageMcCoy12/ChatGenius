import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Message } from '@/types/messages';
import { pusherClient } from '@/lib/pusher';

export function useMessages(channelId: string) {
  const queryClient = useQueryClient();

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

  // Send message mutation
  const { mutateAsync: sendMessage } = useMutation({
    mutationFn: async (message: { text: string; fileUrl?: string }) => {
      try {
        console.log('Sending message:', {
          text: message.text,
          fileUrl: message.fileUrl,
          channelId,
        });

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
          console.error('Server response error:', {
            request: {
              text: message.text,
              fileUrl: message.fileUrl,
              channelId,
            },
            response: {
              status: response.status,
              statusText: response.statusText,
              body: errorData,
              headers: Object.fromEntries(response.headers.entries()),
            }
          });
          throw new Error(`Failed to send message: ${response.status} ${errorData}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Send message error:', error);
        throw error;
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
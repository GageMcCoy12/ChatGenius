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

  // Update message reactions
  const { mutateAsync: updateMessageReactions } = useMutation({
    mutationFn: async ({ messageId, reactions }: { messageId: string; reactions: Message['reactions'] }) => {
      const response = await fetch(`/api/messages/${messageId}/reactions`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reactions }),
      });

      if (!response.ok) {
        throw new Error('Failed to update reactions');
      }

      return response.json();
    },
  });

  // Subscribe to real-time updates
  useEffect(() => {
    if (!channelId) return;

    try {
      const channel = pusherClient.subscribe(channelId);

      channel.bind('new-message', (newMessage: Message) => {
        queryClient.setQueryData(['messages', channelId], (oldMessages: Message[] = []) => [
          ...oldMessages,
          newMessage,
        ]);
      });

      return () => {
        channel.unbind('new-message');
        pusherClient.unsubscribe(channelId);
      };
    } catch (error) {
      console.error('Pusher subscription error:', error);
    }
  }, [channelId, queryClient]);

  return {
    messages,
    loading: isLoading,
    error,
    sendMessage,
    updateMessageReactions,
    refreshMessages: refetch,
  };
} 
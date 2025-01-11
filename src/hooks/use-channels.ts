import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useWebSocket } from './use-websocket';
import { useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';

interface Channel {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  members: Array<{
    userId: string;
    user: {
      id: string;
      username: string;
      imageUrl: string | null;
      isOnline: boolean;
    };
  }>;
}

interface WebSocketEvent {
  action: string;
  data: any;
}

interface UseChannelsReturn {
  channels: Channel[] | undefined;
  isLoading: boolean;
  error: Error | null;
  createChannel: (data: { name: string; description?: string }) => Promise<Channel>;
}

export function useChannels(): UseChannelsReturn {
  const { userId, isLoaded } = useAuth();
  const queryClient = useQueryClient();
  const { subscribe } = useWebSocket();

  // Subscribe to WebSocket events for channel updates
  useEffect(() => {
    const handleChannelEvent = (event: WebSocketEvent) => {
      if (event.action === 'channel-created' || event.action === 'channel-updated') {
        queryClient.invalidateQueries({ queryKey: ['channels'] });
      }
    };

    const unsubscribe = subscribe('global', handleChannelEvent);
    return () => unsubscribe();
  }, [subscribe, queryClient]);

  // Fetch channels
  const { data: channels, isLoading, error } = useQuery({
    queryKey: ['channels'],
    queryFn: async () => {
      if (!isLoaded || !userId) return [];
      
      const response = await fetch('/api/channels');
      if (!response.ok) {
        throw new Error('Failed to fetch channels');
      }
      return response.json();
    },
    enabled: isLoaded && !!userId,
  });

  // Create channel mutation
  const createChannelMutation = useMutation({
    mutationFn: async (data: { name: string; description?: string }) => {
      const response = await fetch('/api/channels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create channel');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['channels'] });
    },
  });

  return {
    channels,
    isLoading,
    error: error as Error | null,
    createChannel: createChannelMutation.mutateAsync,
  };
} 
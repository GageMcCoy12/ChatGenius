"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Channel } from '@prisma/client';
import { usePusher } from './usePusher';

interface UseChannelsReturn {
  channels: Channel[] | undefined;
  isLoading: boolean;
  error: Error | null;
  createChannel: (data: { name: string; description?: string }) => Promise<Channel>;
}

export function useChannels(): UseChannelsReturn {
  const { userId, isLoaded } = useAuth();
  const queryClient = useQueryClient();
  const { subscribe, subscribeToChannel } = usePusher();

  // Subscribe to Pusher events for channel updates
  useEffect(() => {
    if (!isLoaded || !userId) return;

    const unsubscribe = subscribe('channel-created', (data) => {
      queryClient.invalidateQueries({ queryKey: ['channels'] });
    });

    const unsubscribeUpdate = subscribe('channel-updated', (data) => {
      queryClient.invalidateQueries({ queryKey: ['channels'] });
    });

    return () => {
      unsubscribe();
      unsubscribeUpdate();
    };
  }, [subscribe, queryClient, isLoaded, userId]);

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
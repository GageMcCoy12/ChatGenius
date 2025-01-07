import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Channel {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
}

export function useChannels() {
  const queryClient = useQueryClient();
  const query = useQuery<Channel[]>({
    queryKey: ['channels'],
    queryFn: async () => {
      const response = await fetch('/api/channels');
      if (!response.ok) {
        throw new Error('Failed to fetch channels');
      }
      const channels = await response.json();
      // Filter out DM channels
      return channels.filter((channel: Channel) => !channel.id.startsWith('dm-'));
    },
  });

  const { mutateAsync: createChannel } = useMutation({
    mutationFn: async ({ name, description }: { name: string; description?: string }) => {
      const response = await fetch('/api/channels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
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

  return { ...query, createChannel };
} 
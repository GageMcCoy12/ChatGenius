import useSWR from 'swr'

interface Channel {
  id: string;
  name: string;
}

interface UseChannelReturn {
  channel: Channel | null;
  isLoading: boolean;
  error: any;
}

export function useChannel(channelId: string): UseChannelReturn {
  const { data, error, isLoading } = useSWR<Channel>(
    channelId ? `/api/channels/${encodeURIComponent(channelId)}` : null
  );

  return {
    channel: data || null,
    isLoading,
    error
  };
} 
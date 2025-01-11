'use client';

import { useQuery } from '@tanstack/react-query';
import { useUser } from '@clerk/nextjs';
import { ScrollArea } from '../components/ui/scroll-area';

interface Channel {
  id: string;
  name: string;
  users: Array<{
    id: string;
    username: string;
    imageUrl?: string;
  }>;
}

export function AppSidebar() {
  const { user } = useUser();

  const { data: channels, isLoading, error } = useQuery<Channel[]>({
    queryKey: ['channels'],
    queryFn: async () => {
      const response = await fetch('/api/channels');
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        Error loading channels
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">Channels</h2>
          <div className="space-y-1">
            {channels?.map((channel) => (
              <button
                key={channel.id}
                className="w-full rounded-md p-2 hover:bg-accent text-left"
              >
                # {channel.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
} 
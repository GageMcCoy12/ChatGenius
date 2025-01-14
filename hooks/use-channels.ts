"use client"

import { useQuery } from "@tanstack/react-query"

interface Channel {
  id: string
  name: string
  type?: string
}

export function useChannels() {
  const {
    data: allChannels,
    isLoading,
    error,
    refetch: mutate
  } = useQuery<Channel[]>({
    queryKey: ["channels"],
    queryFn: async () => {
      const response = await fetch("/api/channels")
      if (!response.ok) throw new Error("Failed to fetch channels")
      return response.json()
    }
  })

  // Filter out DM channels
  const channels = allChannels?.filter(channel => !channel.id.startsWith('dm-'))

  return {
    channels,
    isLoading,
    error,
    mutate
  }
} 
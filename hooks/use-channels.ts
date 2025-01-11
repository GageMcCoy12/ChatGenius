"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Channel } from "../types/channels"

export function useChannels() {
  const queryClient = useQueryClient()

  const { data: channels = [], isLoading, error } = useQuery<Channel[]>({
    queryKey: ['channels'],
    queryFn: async () => {
      const response = await fetch('/api/channels')
      if (!response.ok) {
        throw new Error('Failed to fetch channels')
      }
      const channels = await response.json()
      return channels
    },
  })

  const createChannel = async ({ name, description }: { name: string; description: string }) => {
    const response = await fetch('/api/channels', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, description }),
    })

    if (!response.ok) {
      throw new Error('Failed to create channel')
    }

    const newChannel = await response.json()
    queryClient.invalidateQueries({ queryKey: ['channels'] })
    return newChannel
  }

  return {
    channels,
    isLoading,
    error,
    createChannel,
  }
} 
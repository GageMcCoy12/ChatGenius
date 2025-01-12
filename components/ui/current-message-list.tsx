"use client"

import { useEffect, useRef } from "react"
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query"
import { Message, User, Reaction } from "@prisma/client"
import { usePusher } from "@/hooks/usePusher"
import { CurrentMessage } from "./current-message"
import { cn } from "@/lib/utils"
import type { PusherMessage } from "@/lib/services/pusher-service"

interface MessageWithDetails extends Message {
  user: User;
  reactions: Reaction[];
  fileUrl: string | null;
  fileName: string | null;
  fileType: string | null;
}

interface CurrentMessageListProps {
  sidebarCollapsed: boolean
  channelId: string
}

export function CurrentMessageList({
  sidebarCollapsed,
  channelId
}: CurrentMessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const { isConnected, subscribe, subscribeToChannel } = usePusher()
  const queryClient = useQueryClient()

  const { 
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['messages', channelId],
    initialPageParam: null,
    queryFn: async ({ pageParam = undefined }) => {
      const response = await fetch(`/api/channels/messages?channelId=${channelId}&cursor=${pageParam || ''}`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      return response.json();
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const messages = data?.pages?.flatMap(page => page.messages).reverse() ?? [];

  // Scroll to bottom when messages change
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Handle real-time messages
  useEffect(() => {
    if (!isConnected || !channelId) return;

    console.log('🔄 Setting up Pusher handlers for channel:', channelId);

    // Subscribe to the channel
    subscribeToChannel(channelId);

    // Set up message handler
    const handleMessage = (message: PusherMessage) => {
      console.log('📨 Received message:', message);

      // Update message cache
      queryClient.setQueryData(['messages', channelId], (oldData: any) => {
        if (!oldData?.pages?.[0]) {
          console.log('❌ No existing messages found in cache');
          return oldData;
        }

        // The message data is already in the correct format from the server
        const newMessage = message.message;
        console.log('✨ Adding new message to cache:', newMessage);

        const newPages = [...oldData.pages];
        newPages[0] = {
          ...newPages[0],
          messages: [newMessage, ...newPages[0].messages]
        };

        return {
          ...oldData,
          pages: newPages
        };
      });

      // Scroll to bottom
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Subscribe to messages
    const unsubscribe = subscribe('message', handleMessage);
    console.log('✅ Subscribed to messages for channel:', channelId);

    return () => {
      console.log('🧹 Cleaning up Pusher handlers for channel:', channelId);
      unsubscribe();
    };
  }, [isConnected, channelId, subscribe, subscribeToChannel, queryClient]);

  if (isLoading) {
    return (
      <div className={cn(
        "fixed top-16 bottom-32 overflow-y-auto transition-all duration-300",
        sidebarCollapsed ? "left-2 right-0" : "left-[20%] right-0"
      )}>
        <div className="animate-pulse space-y-4 pl-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-[#242b3d] rounded-md" />
          ))}
        </div>
      </div>
    )
  }

  if (!messages || messages.length === 0) {
    return (
      <div className={cn(
        "fixed top-16 bottom-32 overflow-y-auto transition-all duration-300",
        sidebarCollapsed ? "left-2 right-0" : "left-[20%] right-0"
      )}>
        <div className="flex items-center justify-center h-full text-gray-400">
          No messages yet
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      "fixed top-16 bottom-32 overflow-y-auto transition-all duration-300",
      sidebarCollapsed ? "left-2 right-0" : "left-[20%] right-0"
    )}>
      <div className="flex flex-col w-full">
        {messages.map((message: MessageWithDetails) => (
          message && message.id ? (
            <CurrentMessage
              key={message.id}
              message={message}
            />
          ) : null
        ))}
      </div>
      <div ref={bottomRef} className="h-4" />
    </div>
  )
} 
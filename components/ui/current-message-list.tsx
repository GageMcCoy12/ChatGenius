"use client"

import { useEffect, useRef } from "react"
import { useMessages } from "@/hooks/use-messages"
import { useWebSocket } from "@/hooks/use-websocket"
import { Message } from "@/types/messages"
import { CurrentMessage } from "./current-message"
import { cn } from "@/lib/utils"

interface CurrentMessageListProps {
  sidebarCollapsed: boolean
  channelId: string
}

export function CurrentMessageList({
  sidebarCollapsed,
  channelId
}: CurrentMessageListProps) {
  const { messages, isLoading, addMessage } = useMessages(channelId)
  const bottomRef = useRef<HTMLDivElement>(null)
  const ws = useWebSocket()

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  useEffect(() => {
    if (!channelId) return

    console.log('Setting up WebSocket subscription for channel:', channelId)
    const unsubscribe = ws.subscribe('message', (event) => {
      console.log('Received WebSocket message:', event)
      if (event.data?.channelId === channelId && event.data?.message) {
        console.log('Adding message to list:', event.data.message)
        addMessage(event.data.message)
      } else {
        console.log('Message not added:', { 
          data: event.data,
          currentChannelId: channelId,
          matches: event.data?.channelId === channelId
        })
      }
    })

    return () => {
      console.log('Cleaning up WebSocket subscription for channel:', channelId)
      unsubscribe()
    }
  }, [channelId, ws, addMessage])

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

  return (
    <div className={cn(
      "fixed top-16 bottom-32 overflow-y-auto transition-all duration-300",
      sidebarCollapsed ? "left-2 right-0" : "left-[20%] right-0"
    )}>
      <div className="flex flex-col w-full">
        {messages.map((message: Message) => (
          <CurrentMessage
            key={message.id}
            message={message}
          />
        ))}
      </div>
      <div ref={bottomRef} className="h-4" />
    </div>
  )
} 
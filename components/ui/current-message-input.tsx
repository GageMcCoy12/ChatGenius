"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Bold, Italic, Underline, Link, Send } from "lucide-react"
import { useParams } from "next/navigation"
import { useWebSocket } from "@/hooks/use-websocket"

interface CurrentMessageInputProps {
  sidebarCollapsed: boolean
}

export function CurrentMessageInput({
  sidebarCollapsed
}: CurrentMessageInputProps) {
  const [content, setContent] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const params = useParams()
  const channelId = params?.channelId as string
  const ws = useWebSocket()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || isLoading) return

    try {
      setIsLoading(true)
      
      // Create message object
      const message = {
        id: Math.random().toString(36).substr(2, 9), // Temporary ID
        content: content.trim(),
        channelId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: "current", // Will be replaced by actual user ID from API
        reactions: [],
        threadCount: 0
      }

      console.log('Sending message through WebSocket:', { channelId, message })
      // Send through WebSocket immediately
      ws.send(channelId, 'message', { 
        channelId,
        message
      })
      console.log('WebSocket send completed')
      
      // Clear input right away
      setContent("")

      // Then save to database
      const response = await fetch('/api/channels/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: message.content,
          channelId
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form 
      onSubmit={handleSubmit}
      className={cn(
        "fixed bottom-0 left-0 right-0 border-t border-[#2a3142] bg-[#1a1f2e] p-4 transition-all duration-300 z-50",
        sidebarCollapsed ? "left-2" : "left-[20%]"
      )}
    >
      <div className="flex flex-col gap-2">
        {/* Formatting Buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="p-2 text-[#566388] hover:text-[#8ba3d4] hover:bg-[#242b3d] rounded-md transition-colors"
            aria-label="Bold"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="p-2 text-[#566388] hover:text-[#8ba3d4] hover:bg-[#242b3d] rounded-md transition-colors"
            aria-label="Italic"
          >
            <Italic className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="p-2 text-[#566388] hover:text-[#8ba3d4] hover:bg-[#242b3d] rounded-md transition-colors"
            aria-label="Underline"
          >
            <Underline className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="p-2 text-[#566388] hover:text-[#8ba3d4] hover:bg-[#242b3d] rounded-md transition-colors"
            aria-label="Add link"
          >
            <Link className="h-4 w-4" />
          </button>
        </div>

        {/* Input Area */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 bg-[#242b3d] text-[#8ba3d4] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#3d4663] placeholder-[#566388]"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!content.trim() || isLoading}
            className={cn(
              "p-2 rounded-md transition-colors",
              content.trim() && !isLoading
                ? "bg-[#3d4663] text-[#8ba3d4] hover:bg-[#4d5673]"
                : "bg-[#242b3d] text-[#566388] cursor-not-allowed"
            )}
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </form>
  )
} 
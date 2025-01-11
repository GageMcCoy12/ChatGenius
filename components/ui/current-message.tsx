"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { User, Reply, SmilePlus } from "lucide-react"
import { Message } from "@/types/messages"
import { format } from "date-fns"

interface CurrentMessageProps {
  message: Message
}

export function CurrentMessage({
  message,
}: CurrentMessageProps) {
  return (
    <div className="group hover:bg-[#1f2437] w-full pl-4 pr-8 py-2 transition-colors">
      <div className="flex gap-3 max-w-[800px]">
        {/* Profile Picture */}
        <div className="flex-shrink-0">
          {message.user.imageUrl ? (
            <img
              src={message.user.imageUrl}
              alt={`${message.user.username}'s profile`}
              className="h-8 w-8 rounded-full"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-[#242b3d] flex items-center justify-center">
              <User className="h-4 w-4 text-[#8ba3d4]" />
            </div>
          )}
        </div>

        {/* Message Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#8ba3d4]">{message.user.username}</span>
            <span className="text-xs text-[#566388]">
              {format(new Date(message.createdAt), 'MMM d, yyyy HH:mm')}
            </span>
          </div>

          {/* Content */}
          <p className="text-[#8ba3d4] mt-1">{message.content}</p>

          {/* Actions and Reactions */}
          <div className="flex items-center gap-4 mt-1">
            {/* Reactions */}
            <div className="flex items-center gap-1">
              {(message.reactions || []).map((reaction) => (
                <button
                  key={reaction.id}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-[#242b3d] text-[#8ba3d4]"
                >
                  <span>{reaction.emoji}</span>
                  <span>1</span>
                </button>
              ))}
              <button
                className="p-1 rounded-full hover:bg-[#242b3d] text-[#566388] hover:text-[#8ba3d4] opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Add reaction"
              >
                <SmilePlus className="h-3 w-3" />
              </button>
            </div>

            {/* Reply */}
            <div className="flex items-center gap-2">
              <button
                className="flex items-center gap-1 text-xs text-[#566388] hover:text-[#8ba3d4] opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Reply to message"
              >
                <Reply className="h-3 w-3" />
                <span>Reply</span>
              </button>
              {message.threadCount > 0 && (
                <span className="text-xs text-[#566388]">
                  {message.threadCount} {message.threadCount === 1 ? "reply" : "replies"}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
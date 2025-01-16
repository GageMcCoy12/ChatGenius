"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Message, User, Reaction } from "@prisma/client"
import { UserAvatar } from "./user-avatar"
import { format } from "date-fns"
import { Reply, SmilePlus } from "lucide-react"
import { EmojiPicker } from "./emoji-picker"
import ReactMarkdown from "react-markdown"
import { TTSButton } from "./tts-button"
import { Button } from "@/components/ui/button"

interface MessageWithDetails extends Message {
  user: User;
  reactions: Reaction[];
  fileUrl: string | null;
  fileName: string | null;
  fileType: string | null;
}

interface CurrentMessageProps {
  message?: MessageWithDetails;
  content?: string;
  user?: User;
  isAI?: boolean;
  onReactionAdd?: (messageId: string, emoji: string) => void;
  onReactionRemove?: (messageId: string, emoji: string) => void;
  onThreadOpen?: (message: MessageWithDetails) => void;
}

export function CurrentMessage({
  message,
  content: directContent,
  user: directUser,
  isAI,
  onReactionAdd,
  onReactionRemove,
  onThreadOpen,
}: CurrentMessageProps) {
  const [showActions, setShowActions] = React.useState(false)

  // Use either direct props (for AI) or message object (for regular messages)
  const displayContent = directContent || message?.content
  const displayUser = directUser || message?.user
  const isAIMessage = isAI || message?.isAI

  if (!displayContent || !displayUser) return null

  return (
    <div
      className="group relative flex items-start gap-3 py-4 px-4 hover:bg-[#242b3d]/50 transition-colors"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <UserAvatar
        src={displayUser.imageUrl}
        fallback={displayUser.username?.[0]?.toUpperCase()}
      />

      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-zinc-200">
            {displayUser.username}
          </span>
          <span className="text-xs text-zinc-400">
            {format(new Date(message?.createdAt || new Date()), 'p')}
          </span>
        </div>

        <div className="text-sm text-zinc-200">
          <ReactMarkdown>{displayContent}</ReactMarkdown>
        </div>

        {/* Show file if present */}
        {message?.fileUrl && (
          <div className="mt-2">
            {message.fileType?.startsWith('image') ? (
              <img
                src={message.fileUrl}
                alt={message.fileName || 'Uploaded image'}
                className="max-w-md rounded-md"
              />
            ) : (
              <a
                href={message.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                {message.fileName || 'Download file'}
              </a>
            )}
          </div>
        )}
      </div>

      {/* Message Actions */}
      <div className={cn(
        "absolute right-4 top-4 flex items-center gap-2 transition-opacity",
        showActions ? "opacity-100" : "opacity-0"
      )}>
        <TTSButton
          text={displayContent}
          className="text-zinc-400 hover:text-zinc-200"
        />
        {onThreadOpen && message && (
          <Button
            onClick={() => onThreadOpen(message)}
            variant="ghost"
            size="icon"
            className="text-zinc-400 hover:text-zinc-200"
          >
            <Reply className="h-4 w-4" />
          </Button>
        )}
        {onReactionAdd && message && (
          <EmojiPicker 
            onEmojiSelect={(emoji) => onReactionAdd(message.id, emoji)}
            triggerClassName="text-zinc-400 hover:text-zinc-200"
          />
        )}
      </div>
    </div>
  )
} 
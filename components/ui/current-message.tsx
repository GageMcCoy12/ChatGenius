"use client"

import * as React from "react"
import { cn } from "../../lib/utils"
import { User as UserIcon, Reply, SmilePlus, FileIcon, ImageIcon, VideoIcon, Music2Icon, FileTextIcon } from "lucide-react"
import { Message, User, Reaction } from "@prisma/client"
import { format } from "date-fns"
import { EmojiPicker } from "./emoji-picker"
import { useUser } from "@clerk/nextjs"

interface MessageWithDetails extends Message {
  user: User;
  reactions: Reaction[];
  fileUrl: string | null;
  fileName: string | null;
  fileType: string | null;
}

interface CurrentMessageProps {
  message: MessageWithDetails;
  onReactionAdd?: (messageId: string, emoji: string) => void;
  onReactionRemove?: (messageId: string, emoji: string) => void;
}

function formatMessageContent(content: string) {
  return content
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/_(.*?)_/g, '<em>$1</em>')
    // Underline
    .replace(/__(.*?)__/g, '<span class="underline">$1</span>')
}

function FileAttachment({ fileUrl, fileName, fileType }: { fileUrl: string, fileName: string, fileType: string }) {
  let Icon = FileIcon
  let preview = null

  if (fileType.startsWith('image/')) {
    Icon = ImageIcon
    preview = (
      <div className="mt-2 max-w-sm">
        <img 
          src={fileUrl} 
          alt={fileName}
          className="rounded-md max-h-48 object-cover hover:opacity-90 transition-opacity cursor-pointer"
          onClick={() => window.open(fileUrl, '_blank')}
        />
      </div>
    )
  } else if (fileType.startsWith('video/')) {
    Icon = VideoIcon
    preview = (
      <div className="mt-2 max-w-sm">
        <video 
          src={fileUrl}
          controls
          className="rounded-md max-h-48 w-full"
        >
          Your browser does not support the video tag.
        </video>
      </div>
    )
  } else if (fileType.startsWith('audio/')) {
    Icon = Music2Icon
    preview = (
      <div className="mt-2 max-w-sm w-full">
        <audio 
          src={fileUrl}
          controls
          className="w-full"
        >
          Your browser does not support the audio tag.
        </audio>
      </div>
    )
  } else if (fileType.includes('pdf') || fileType.includes('doc')) {
    Icon = FileTextIcon
  }

  return (
    <div className="mt-2">
      <a 
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-[#8ba3d4] hover:text-[#7691c7] transition-colors"
        download={fileName}
      >
        <Icon className="h-4 w-4" />
        <span className="text-sm underline">{fileName}</span>
      </a>
      {preview}
    </div>
  )
}

export function CurrentMessage({
  message,
  onReactionAdd,
  onReactionRemove
}: CurrentMessageProps) {
  const { user: currentUser } = useUser();
  const [groupedReactions, setGroupedReactions] = React.useState<{ [key: string]: string[] }>({});

  React.useEffect(() => {
    // Group reactions by emoji
    const grouped = message.reactions.reduce((acc, reaction) => {
      if (!acc[reaction.emoji]) {
        acc[reaction.emoji] = [];
      }
      acc[reaction.emoji].push(reaction.userId);
      return acc;
    }, {} as { [key: string]: string[] });
    setGroupedReactions(grouped);
  }, [message.reactions]);

  const handleEmojiSelect = async (emoji: string) => {
    if (!currentUser?.id || !onReactionAdd) return;

    const hasReacted = message.reactions.some(
      (reaction) => reaction.userId === currentUser.id && reaction.emoji === emoji
    );

    if (hasReacted && onReactionRemove) {
      onReactionRemove(message.id, emoji);
    } else {
      onReactionAdd(message.id, emoji);
    }
  };

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
              <UserIcon className="h-4 w-4 text-[#8ba3d4]" />
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
          <p 
            className="text-zinc-200 break-words"
            dangerouslySetInnerHTML={{ __html: formatMessageContent(message.content) }}
          />

          {/* File Attachment */}
          {message.fileUrl && message.fileName && message.fileType && (
            <FileAttachment 
              fileUrl={message.fileUrl}
              fileName={message.fileName}
              fileType={message.fileType}
            />
          )}

          {/* Actions and Reactions */}
          <div className="flex items-center gap-4 mt-1">
            {/* Reactions */}
            <div className="flex items-center gap-1 flex-wrap">
              {Object.entries(groupedReactions).map(([emoji, userIds]) => (
                <button
                  key={emoji}
                  onClick={() => handleEmojiSelect(emoji)}
                  className={cn(
                    "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-[#242b3d] hover:bg-[#2a324a] transition-colors",
                    userIds.includes(currentUser?.id || "") ? "text-[#8ba3d4]" : "text-[#566388]"
                  )}
                >
                  <span>{emoji}</span>
                  <span>{userIds.length}</span>
                </button>
              ))}
              <EmojiPicker onEmojiSelect={handleEmojiSelect} />
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
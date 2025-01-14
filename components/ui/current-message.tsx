"use client"

import { cn } from "@/lib/utils";
import { Message, User, Reaction } from "@prisma/client";
import { UserAvatar } from "./user-avatar";
import { format } from "date-fns";
import { Reply, SmilePlus } from "lucide-react";
import { EmojiPicker } from "./emoji-picker";
import ReactMarkdown from "react-markdown";

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
  isAI = false,
  onReactionAdd,
  onReactionRemove,
  onThreadOpen,
}: CurrentMessageProps) {
  // Use either direct props (for AI) or message object (for regular messages)
  const displayContent = directContent || message?.content;
  const user = directUser || message?.user;

  if (!displayContent || !user) return null;

  // Group reactions by emoji
  const groupedReactions = message?.reactions?.reduce((acc, reaction) => {
    if (!acc[reaction.emoji]) {
      acc[reaction.emoji] = [];
    }
    acc[reaction.emoji].push(reaction.userId);
    return acc;
  }, {} as { [key: string]: string[] }) || {};

  return (
    <div className={cn(
      "group hover:bg-[#1f2437] w-full pl-4 pr-8 py-2 transition-colors",
      isAI && "bg-indigo-50/10 hover:bg-indigo-50/20"
    )}>
      <div className="flex gap-3 max-w-[800px]">
        <div className="flex-shrink-0">
          <UserAvatar 
            src={isAI ? "/ai-avatar.png" : user.imageUrl} 
            fallback={isAI ? "AI" : user.username?.[0]}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={cn(
              "font-semibold",
              isAI ? "text-indigo-400" : "text-[#8ba3d4]"
            )}>
              {isAI ? "AI Assistant" : user.username}
            </span>
            {message && (
              <span className="text-xs text-[#566388]">
                {format(new Date(message.createdAt), "MMM d, yyyy HH:mm")}
              </span>
            )}
          </div>

          <div className={cn(
            "text-zinc-200 break-words prose prose-invert max-w-none whitespace-pre-wrap",
            "prose-p:leading-normal prose-p:my-1",
            "prose-code:bg-[#2a3142] prose-code:px-1 prose-code:py-0.5 prose-code:rounded",
            "prose-pre:bg-[#2a3142] prose-pre:p-3 prose-pre:rounded-md",
            "prose-a:text-[#8ba3d4] prose-a:no-underline hover:prose-a:underline",
            "prose-strong:text-[#8ba3d4] prose-em:text-[#8ba3d4]",
            "prose-ul:my-1 prose-ol:my-1 prose-li:my-0",
            isAI && "prose-headings:text-indigo-400"
          )}>
            <ReactMarkdown className="whitespace-pre-wrap">
              {displayContent}
            </ReactMarkdown>
          </div>

          {!isAI && message && (
            <div className="flex items-center gap-4 mt-1">
              {/* Reactions */}
              <div className="flex items-center gap-1 flex-wrap">
                {Object.entries(groupedReactions).map(([emoji, userIds]) => (
                  <button
                    key={emoji}
                    onClick={() => onReactionAdd?.(message.id, emoji)}
                    className={cn(
                      "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-[#242b3d] hover:bg-[#2a324a] transition-colors",
                      userIds.includes(user.id) ? "text-[#8ba3d4]" : "text-[#566388]"
                    )}
                  >
                    <span>{emoji}</span>
                    <span>{userIds.length}</span>
                  </button>
                ))}
                <EmojiPicker onEmojiSelect={(emoji) => onReactionAdd?.(message.id, emoji)} />
              </div>

              {/* Reply button */}
              <button
                onClick={() => onThreadOpen?.(message)}
                className="flex items-center gap-1 text-xs text-[#566388] hover:text-[#8ba3d4] opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Reply className="h-3 w-3" />
                <span>Reply</span>
              </button>

              {/* Thread count */}
              {message.threadCount > 0 && (
                <button
                  onClick={() => onThreadOpen?.(message)}
                  className="text-xs text-[#566388] hover:text-[#8ba3d4]"
                >
                  {message.threadCount} {message.threadCount === 1 ? "reply" : "replies"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
"use client"

import * as React from "react"
import { Message, User, Reaction } from "@prisma/client"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { CurrentMessage } from "./current-message"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import { CurrentMessageInput } from "./current-message-input"

interface MessageWithDetails extends Message {
  user: User;
  reactions: Reaction[];
  fileUrl: string | null;
  fileName: string | null;
  fileType: string | null;
}

interface ThreadViewProps {
  parentMessage: MessageWithDetails;
  isOpen: boolean;
  onClose: () => void;
}

export function ThreadView({
  parentMessage,
  isOpen,
  onClose
}: ThreadViewProps) {
  const queryClient = useQueryClient();

  const { data: replies = [], isLoading } = useQuery({
    queryKey: ['thread', parentMessage.id],
    queryFn: async () => {
      const response = await fetch(`/api/messages/${parentMessage.id}/thread`);
      if (!response.ok) throw new Error('Failed to fetch thread messages');
      return response.json();
    },
    enabled: isOpen,
  });

  // Add reaction handlers
  const handleReactionAdd = async (messageId: string, emoji: string) => {
    const message = messageId === parentMessage.id ? parentMessage : replies.find((r: MessageWithDetails) => r.id === messageId);
    if (!message) return;

    const currentUserId = message.userId; // We'll use this for the new reaction

    // Optimistically update the UI
    queryClient.setQueryData(['thread', parentMessage.id], (old: MessageWithDetails[] | undefined) => {
      if (!old) return [];
      const messages = [...old];
      const messageIndex = messages.findIndex(m => m.id === messageId);
      if (messageIndex === -1) return messages;

      const newReaction: Partial<Reaction> = {
        emoji,
        userId: currentUserId,
        messageId: messageId,
      };

      const updatedMessage = {
        ...messages[messageIndex],
        reactions: [
          ...messages[messageIndex].reactions,
          newReaction as Reaction
        ]
      };
      messages[messageIndex] = updatedMessage;
      return messages;
    });

    try {
      const response = await fetch(`/api/messages/${messageId}/reactions`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reactions: [
            ...message.reactions,
            { emoji, userId: currentUserId }
          ]
        })
      });

      if (!response.ok) throw new Error('Failed to add reaction');

      // Invalidate both thread and channel queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['thread', parentMessage.id] }),
        queryClient.invalidateQueries({ queryKey: ['messages', parentMessage.channelId] })
      ]);
    } catch (error) {
      console.error('Failed to add reaction:', error);
      // Revert optimistic update
      queryClient.invalidateQueries({ queryKey: ['thread', parentMessage.id] });
    }
  };

  const handleReactionRemove = async (messageId: string, emoji: string) => {
    const message = messageId === parentMessage.id ? parentMessage : replies.find((r: MessageWithDetails) => r.id === messageId);
    if (!message) return;

    const currentUserId = message.userId;

    // Optimistically update the UI
    queryClient.setQueryData(['thread', parentMessage.id], (old: MessageWithDetails[] | undefined) => {
      if (!old) return [];
      const messages = [...old];
      const messageIndex = messages.findIndex(m => m.id === messageId);
      if (messageIndex === -1) return messages;

      const updatedMessage = {
        ...messages[messageIndex],
        reactions: messages[messageIndex].reactions.filter(
          (r: Reaction) => !(r.emoji === emoji && r.userId === currentUserId)
        )
      };
      messages[messageIndex] = updatedMessage;
      return messages;
    });

    try {
      const response = await fetch(`/api/messages/${messageId}/reactions`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reactions: message.reactions.filter(
            (r: Reaction) => !(r.emoji === emoji && r.userId === currentUserId)
          )
        })
      });

      if (!response.ok) throw new Error('Failed to remove reaction');

      // Invalidate both thread and channel queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['thread', parentMessage.id] }),
        queryClient.invalidateQueries({ queryKey: ['messages', parentMessage.channelId] })
      ]);
    } catch (error) {
      console.error('Failed to remove reaction:', error);
      // Revert optimistic update
      queryClient.invalidateQueries({ queryKey: ['thread', parentMessage.id] });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-16 right-0 bottom-0 w-[400px] bg-[#1a1d2d] border-l border-[#242b3d] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#242b3d]">
        <h3 className="text-sm font-semibold text-[#8ba3d4]">Thread</h3>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-[#242b3d] text-[#566388] hover:text-[#8ba3d4] transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Parent Message */}
      <div className="px-2 py-4 border-b border-[#242b3d]">
        <CurrentMessage
          message={parentMessage}
          isThreadParent
          onReactionAdd={handleReactionAdd}
          onReactionRemove={handleReactionRemove}
        />
      </div>

      {/* Thread Messages */}
      <div className="flex-1 overflow-y-auto px-2">
        {isLoading ? (
          <div className="animate-pulse space-y-4 py-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-[#242b3d] rounded-md" />
            ))}
          </div>
        ) : replies.length === 0 ? (
          <div className="flex items-center justify-center h-full text-[#566388]">
            No replies yet
          </div>
        ) : (
          <div className="py-4 space-y-2">
            {replies.map((reply: MessageWithDetails) => (
              <CurrentMessage
                key={reply.id}
                message={reply}
                isThreadReply
                onReactionAdd={handleReactionAdd}
                onReactionRemove={handleReactionRemove}
              />
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-[#242b3d]">
        <CurrentMessageInput
          channelId={parentMessage.channelId}
          replyToId={parentMessage.id}
          placeholder="Reply in thread..."
        />
      </div>
    </div>
  );
} 
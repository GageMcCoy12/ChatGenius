'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Message } from '@/types/messages';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Smile } from 'lucide-react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface MessageReactionsProps {
  messageId: string;
  initialReactions: Message['reactions'];
  onReactionsUpdate: (messageId: string, reactions: Message['reactions']) => void;
}

export function MessageReactions({ messageId, initialReactions, onReactionsUpdate }: MessageReactionsProps) {
  const { user } = useUser();
  const [reactions, setReactions] = useState(initialReactions);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleEmojiSelect = (emoji: any) => {
    if (!user) return;

    const newReaction = {
      id: `temp-${Date.now()}`, // Temporary ID, server will assign real one
      emoji: emoji.native,
      userId: user.id,
      user: {
        id: user.id,
        username: user.username || user.firstName || 'User',
        imageURL: user.imageUrl,
      },
    };

    // Check if user has already used this emoji
    const existingReactionIndex = reactions.findIndex(
      r => r.emoji === emoji.native && r.userId === user.id
    );

    let updatedReactions;
    if (existingReactionIndex > -1) {
      // Remove the reaction if it exists
      updatedReactions = reactions.filter((_, index) => index !== existingReactionIndex);
    } else {
      // Add the new reaction
      updatedReactions = [...reactions, newReaction];
    }

    setReactions(updatedReactions);
    onReactionsUpdate(messageId, updatedReactions);
    setIsPickerOpen(false);
  };

  // Group reactions by emoji
  const groupedReactions = reactions.reduce((acc, reaction) => {
    if (!acc[reaction.emoji]) {
      acc[reaction.emoji] = [];
    }
    acc[reaction.emoji].push(reaction);
    return acc;
  }, {} as Record<string, typeof reactions>);

  return (
    <div className="flex items-center gap-2 mt-1">
      {Object.entries(groupedReactions).map(([emoji, users]) => (
        <Button
          key={emoji}
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs"
          onClick={() => handleEmojiSelect({ native: emoji })}
        >
          {emoji} {users.length}
        </Button>
      ))}
      <Popover open={isPickerOpen} onOpenChange={setIsPickerOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <Smile className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 border-none">
          <Picker
            data={data}
            onEmojiSelect={handleEmojiSelect}
            theme="light"
            previewPosition="none"
            skinTonePosition="none"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
} 
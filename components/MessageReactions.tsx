'use client';

import { useState } from 'react';
import { Message, Reaction } from '@/types/messages';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Smile } from 'lucide-react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface MessageReactionsProps {
  messageId: string;
  reactions: Reaction[];
  onUpdate: (messageId: string, reactions: Reaction[]) => void;
}

interface GroupedReactions {
  [emoji: string]: Reaction[];
}

export function MessageReactions({ messageId, reactions, onUpdate }: MessageReactionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleEmojiSelect = (emoji: { native: string }) => {
    setIsOpen(false);
    const newReactions = [...reactions];
    onUpdate(messageId, newReactions);
  };

  // Group reactions by emoji
  const groupedReactions = reactions.reduce<GroupedReactions>((acc, reaction) => {
    if (!acc[reaction.emoji]) {
      acc[reaction.emoji] = [];
    }
    acc[reaction.emoji].push(reaction);
    return acc;
  }, {});

  return (
    <div className="flex items-center gap-1">
      {Object.entries(groupedReactions).map(([emoji, reactions]) => (
        <Button
          key={emoji}
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs gap-1"
          onClick={() => handleEmojiSelect({ native: emoji })}
        >
          <span>{emoji}</span>
          <span>{reactions.length}</span>
        </Button>
      ))}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-muted"
          >
            <Smile className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Picker
            data={data}
            onEmojiSelect={handleEmojiSelect}
            theme="light"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
} 
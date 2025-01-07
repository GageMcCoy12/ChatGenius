'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Smile } from 'lucide-react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { Message } from '@/types/messages';

interface MessageReactionsProps {
  messageId: string;
  initialReactions: Message['reactions'];
  onReactionsUpdate: (messageId: string, reactions: Message['reactions']) => void;
}

export function MessageReactions({ 
  messageId, 
  initialReactions,
  onReactionsUpdate 
}: MessageReactionsProps) {
  const [reactions, setReactions] = useState<Message['reactions']>(initialReactions);

  const handleEmojiSelect = async (emoji: any) => {
    try {
      const response = await fetch(`/api/messages/${messageId}/reactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emoji: emoji.native }),
      });

      if (!response.ok) throw new Error('Failed to add reaction');

      const updatedReactions = await response.json();
      setReactions(updatedReactions);
      onReactionsUpdate(messageId, updatedReactions);
    } catch (error) {
      console.error('Failed to add reaction:', error);
    }
  };

  return (
    <div className="flex items-center gap-1 mt-1">
      {reactions.map((reaction) => (
        <Button
          key={reaction.emoji}
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs gap-1"
          onClick={() => handleEmojiSelect({ native: reaction.emoji })}
        >
          <span>{reaction.emoji}</span>
          <span>{reaction._count}</span>
        </Button>
      ))}
      <Popover>
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
          />
        </PopoverContent>
      </Popover>
    </div>
  );
} 
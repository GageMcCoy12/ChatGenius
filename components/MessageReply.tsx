'use client';

import { Message } from '@/types/messages';
import { X } from 'lucide-react';

interface MessageReplyProps {
  replyTo: NonNullable<Message['replyTo']>;
  onCancelReply: () => void;
}

export function MessageReply({ replyTo, onCancelReply }: MessageReplyProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-md">
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">
          Replying to <span className="font-medium">{replyTo.user.username}</span>
        </p>
        <p className="text-sm truncate">{replyTo.text}</p>
      </div>
      <button
        onClick={onCancelReply}
        className="flex-shrink-0 p-1 hover:bg-muted rounded-md"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
} 
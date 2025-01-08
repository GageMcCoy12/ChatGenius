/**
 * MessageList Component
 * 
 * Displays a list of messages in a chat interface with support for:
 * - User avatars and names
 * - Message timestamps
 * - Message replies
 * - File attachments
 * - Emoji reactions
 * - Reply functionality
 * - Markdown formatting
 * 
 * @component
 * @example
 * ```tsx
 * <MessageList
 *   messages={messages}
 *   onReactionsUpdate={handleReactionsUpdate}
 *   onReplyToMessage={handleReplyToMessage}
 * />
 * ```
 */

'use client';

import { Message } from '@/types/messages';
import { MessageBubble } from '@/components/MessageBubble';
import { useState } from 'react';
import { MessageThread } from './MessageThread';

interface MessageListProps {
  messages: Message[];
  isThread?: boolean;
}

export function MessageList({ messages, isThread = false }: MessageListProps) {
  const [activeThread, setActiveThread] = useState<Message | null>(null);

  const handleThreadClick = (message: Message) => {
    if (!isThread) {
      setActiveThread(message);
    }
  };

  // Filter out thread messages from main chat
  const filteredMessages = isThread 
    ? messages 
    : messages.filter(message => !message.isThread);

  return (
    <>
      <div className="space-y-6 p-4">
        {filteredMessages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isThreadMessage={isThread}
            onThreadClick={() => handleThreadClick(message)}
          />
        ))}
      </div>

      {activeThread && (
        <MessageThread
          parentMessage={activeThread}
          onClose={() => setActiveThread(null)}
          className="z-50"
        />
      )}
    </>
  );
} 
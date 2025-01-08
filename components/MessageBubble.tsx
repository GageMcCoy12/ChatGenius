'use client';

import { Message } from '@/types/messages';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { MessageReactions } from './MessageReactions';
import { MessageAttachment } from './MessageAttachment';
import { UserCard } from './UserCard';
import { Button } from './ui/button';
import { MessageSquare } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface MessageBubbleProps {
  message: Message;
  isThreadMessage?: boolean;
  onThreadClick?: () => void;
}

export function MessageBubble({ 
  message, 
  isThreadMessage = false,
  onThreadClick 
}: MessageBubbleProps) {
  const hasReplies = !isThreadMessage && message.replyCount > 0;

  return (
    <div className="group flex gap-4">
      <UserCard user={message.user}>
        <Avatar className="h-8 w-8">
          <AvatarImage src={message.user.imageURL} />
          <AvatarFallback>{message.user.username[0]}</AvatarFallback>
        </Avatar>
      </UserCard>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <UserCard user={message.user}>
            <span className="font-semibold hover:underline cursor-pointer">
              {message.user.username}
            </span>
          </UserCard>
          <span className="text-xs text-muted-foreground">
            {format(new Date(message.createdAt), 'MMM d, yyyy HH:mm')}
          </span>
          {hasReplies && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">•</span>
              <div className="flex -space-x-2">
                {message.replies?.slice(0, 3).map((reply) => (
                  <Avatar key={reply.id} className="h-5 w-5 border-2 border-background">
                    <AvatarImage src={reply.user.imageURL} />
                    <AvatarFallback>{reply.user.username[0]}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-foreground"
                onClick={onThreadClick}
              >
                {message.replyCount} {message.replyCount === 1 ? 'reply' : 'replies'}
              </Button>
            </div>
          )}
        </div>

        <div className="mt-1">
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="text-sm">{children}</p>,
            }}
          >
            {message.text}
          </ReactMarkdown>
          {message.attachments?.map((attachment) => (
            <div key={attachment.id} className="mt-2">
              <MessageAttachment fileUrl={attachment.fileUrl} />
            </div>
          ))}
        </div>

        <div className="mt-2 flex items-center gap-4">
          <MessageReactions
            messageId={message.id}
            reactions={message.reactions}
            onUpdate={() => {}}
          />
          {!isThreadMessage && !hasReplies && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
              onClick={onThreadClick}
            >
              <MessageSquare className="h-4 w-4" />
              <span>Reply in Thread</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
} 
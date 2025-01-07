import { useUser } from '@clerk/nextjs';
import { Message } from '@/types/messages';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { MessageReactions } from './MessageReactions';
import { MessageAttachment } from './MessageAttachment';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MessageListProps {
  messages: Message[];
  onReactionsUpdate?: (messageId: string, reactions: Message['reactions']) => void;
}

export const MessageList = ({ messages, onReactionsUpdate }: MessageListProps) => {
  const { user } = useUser();

  return (
    <div className="flex flex-col space-y-4 p-4 w-full">
      {messages.map((message) => (
        <div key={message.id} className="flex items-start gap-3 max-w-4xl mx-auto w-full">
          <Avatar className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0">
            <AvatarImage
              src={message.user.imageURL || '/default-avatar.png'}
              alt={message.user.username}
              className="h-full w-full object-cover"
            />
            <AvatarFallback>
              {message.user.username.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {message.user.username}
              </span>
              <span className="text-xs text-muted-foreground">
                {format(new Date(message.createdAt), 'HH:mm')}
              </span>
            </div>
            {message.text && (
              <div className="rounded-lg px-4 py-2 bg-muted max-w-sm prose prose-sm dark:prose-invert">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.text}
                </ReactMarkdown>
              </div>
            )}
            {message.attachments.length > 0 && (
              <div className="flex flex-col gap-2">
                {message.attachments.map((attachment) => (
                  <MessageAttachment 
                    key={attachment.id} 
                    attachment={attachment} 
                  />
                ))}
              </div>
            )}
            {onReactionsUpdate && (
              <MessageReactions 
                messageId={message.id} 
                initialReactions={message.reactions} 
                onReactionsUpdate={onReactionsUpdate}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}; 
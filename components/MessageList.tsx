import { useUser } from '@clerk/nextjs';
import { Message } from '@/types/messages';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { format } from 'date-fns';

interface MessageListProps {
  messages: Message[];
}

export const MessageList = ({ messages }: MessageListProps) => {
  const { user } = useUser();

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            'flex items-start gap-3',
            message.userId === user?.id && 'justify-end'
          )}
        >
          {message.userId !== user?.id && (
            <Avatar>
              <img
                src={message.user.imageURL || '/default-avatar.png'}
                alt={message.user.username}
                className="h-8 w-8 rounded-full"
              />
            </Avatar>
          )}
          <div
            className={cn(
              'flex flex-col',
              message.userId === user?.id && 'items-end'
            )}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {message.user.username}
              </span>
              <span className="text-xs text-muted-foreground">
                {format(new Date(message.createdAt), 'HH:mm')}
              </span>
            </div>
            <div
              className={cn(
                'rounded-lg px-4 py-2 max-w-sm',
                message.userId === user?.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              )}
            >
              {message.text}
            </div>
          </div>
          {message.userId === user?.id && (
            <Avatar>
              <img
                src={message.user.imageURL || '/default-avatar.png'}
                alt={message.user.username}
                className="h-8 w-8 rounded-full"
              />
            </Avatar>
          )}
        </div>
      ))}
    </div>
  );
}; 
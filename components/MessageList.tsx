import { useUser } from '@clerk/nextjs';
import { Message } from '@/types/messages';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { format } from 'date-fns';

interface MessageListProps {
  messages: Message[];
}

export const MessageList = ({ messages }: MessageListProps) => {
  const { user } = useUser();

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div key={message.id} className="flex items-start gap-3">
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
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {message.user.username}
              </span>
              <span className="text-xs text-muted-foreground">
                {format(new Date(message.createdAt), 'HH:mm')}
              </span>
            </div>
            <div className="rounded-lg px-4 py-2 bg-muted max-w-sm">
              {message.text}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}; 
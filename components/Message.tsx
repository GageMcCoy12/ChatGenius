import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from 'date-fns'

interface MessageProps {
  text: string;
  timestamp: Date;
  user: {
    imageUrl: string;
    username: string;
    fullName: string;
  };
}

export function Message({ text, timestamp, user }: MessageProps) {
  return (
    <div className="flex gap-4 group">
      <div className="flex flex-col items-center gap-1 min-w-[80px]">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.imageUrl} alt={user.fullName} />
          <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <span className="text-xs font-medium text-center text-muted-foreground">
          @{user.username}
        </span>
      </div>
      <div className="flex-1 max-w-[calc(100%-120px)]">
        <div className="bg-muted rounded-lg p-4">
          <p className="text-base leading-relaxed break-all whitespace-pre-line overflow-hidden">
            {text}
          </p>
        </div>
        <span className="text-xs text-muted-foreground mt-1 block">
          {format(timestamp, 'HH:mm')}
        </span>
      </div>
    </div>
  )
} 
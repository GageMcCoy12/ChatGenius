import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  src?: string | null;
  className?: string;
  fallback?: string;
}

export function UserAvatar({ src, className, fallback }: UserAvatarProps) {
  return (
    <Avatar className={cn("h-8 w-8", className)}>
      <AvatarImage src={src || undefined} />
      {fallback && <AvatarFallback>{fallback}</AvatarFallback>}
    </Avatar>
  );
} 
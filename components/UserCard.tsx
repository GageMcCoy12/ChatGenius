'use client';

import { useRouter } from 'next/navigation';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useActiveUsers } from '@/hooks/use-active-users';

interface UserCardProps {
  user: {
    id: string;
    username: string;
    imageURL?: string | null;
  };
  children: React.ReactNode;
}

export function UserCard({ user, children }: UserCardProps) {
  const router = useRouter();
  const { activeUsers } = useActiveUsers();
  const isActive = activeUsers?.includes(user.id);

  const handleStartDM = () => {
    router.push(`/dm/${user.id}`);
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.imageURL || undefined} />
              <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold">{user.username}</h4>
              <p className="text-sm text-muted-foreground">
                {isActive ? 'Active now' : 'Offline'}
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={handleStartDM}
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
} 
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SignInButton, useUser, useClerk } from "@clerk/nextjs"
import { Badge } from "@/components/ui/badge"
import { useCurrentUser } from "@/hooks/use-current-user"
import { usePathname } from 'next/navigation'
import { useUsers } from '@/hooks/use-users'
import { useChannels } from '@/hooks/use-channels'
import { Hash, User } from 'lucide-react'

interface HeaderProps {
  channelName: string;
}

export function Header({ channelName }: HeaderProps) {
  const { user: clerkUser, isSignedIn } = useUser()
  const { data: currentUser, isLoading } = useCurrentUser()
  const { signOut } = useClerk()
  const pathname = usePathname()
  const { data: users } = useUsers()
  const { data: channels } = useChannels()

  const getContextTitle = () => {
    if (pathname?.startsWith('/channels/')) {
      const channelName = pathname.split('/').pop();
      const channel = channels?.find(c => c.name.toLowerCase() === channelName?.toLowerCase());
      return channel ? (
        <div className="flex items-center gap-2">
          <Hash className="h-5 w-5" />
          {channel.name}
        </div>
      ) : 'ChatGenius';
    }

    if (pathname?.startsWith('/dm/')) {
      const userId = pathname.split('/').pop();
      const user = users?.find(u => u.id === userId);
      return user ? (
        <div className="flex items-center gap-2">
          <User className="h-5 w-5" />
          {user.username}
        </div>
      ) : 'ChatGenius';
    }

    return 'ChatGenius';
  };

  const handleSignOut = () => {
    signOut()
  }

  return (
    <header className="fixed top-0 left-[240px] right-0 bg-background border-b z-1">
      <div className="flex h-16 items-center px-8">
        <h2 className="text-lg font-semibold">{getContextTitle()}</h2>
        <div className="ml-auto flex items-center space-x-4">
          {isSignedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={clerkUser?.imageUrl} alt={clerkUser?.fullName || '@user'} />
                    <AvatarFallback>{clerkUser?.firstName?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{clerkUser?.fullName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {clerkUser?.primaryEmailAddress?.emailAddress}
                    </p>
                    {!isLoading && currentUser && (
                      <Badge 
                        variant="secondary" 
                        className="w-fit mt-1"
                      >
                        {currentUser.role.name}
                      </Badge>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <SignInButton>
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </SignInButton>
          )}
        </div>
      </div>
    </header>
  )
}


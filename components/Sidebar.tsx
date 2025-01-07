'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, Hash, User } from 'lucide-react'
import { useUsers } from '@/hooks/use-users'
import { useChannels } from '@/hooks/use-channels'
import { ChannelCreateDialog } from './ChannelCreateDialog'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { PresenceIndicator } from './PresenceIndicator'
import { useActiveUsers } from '@/hooks/use-active-users'

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

export function AppSidebar() {
  const pathname = usePathname()
  const [channelsOpen, setChannelsOpen] = React.useState(true)
  const [directMessagesOpen, setDirectMessagesOpen] = React.useState(true)
  const { data: users, isLoading: isLoadingUsers } = useUsers()
  const { data: channels, isLoading: isLoadingChannels } = useChannels()
  const { activeUsers } = useActiveUsers()

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <span className="font-semibold">ChatGenius</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <Collapsible
          open={channelsOpen}
          onOpenChange={setChannelsOpen}
          className="space-y-2"
        >
          <div className="flex items-center justify-between">
            <CollapsibleTrigger asChild>
              <SidebarMenuButton className="flex-1 justify-between">
                Channels
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    channelsOpen ? 'rotate-180 transform' : ''
                  }`}
                />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <ChannelCreateDialog />
          </div>
          <CollapsibleContent>
            <SidebarMenu>
              {isLoadingChannels ? (
                <SidebarMenuItem>
                  <SidebarMenuButton disabled>
                    Loading channels...
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ) : channels?.map((channel) => (
                <SidebarMenuItem key={channel.id}>
                  <Link href={`/channels/${channel.name.toLowerCase()}`} passHref legacyBehavior>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === `/channels/${channel.name.toLowerCase()}`}
                    >
                      <a>
                        <Hash className="mr-2 h-4 w-4" />
                        {channel.name}
                      </a>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible
          open={directMessagesOpen}
          onOpenChange={setDirectMessagesOpen}
          className="space-y-2 mt-4"
        >
          <CollapsibleTrigger asChild>
            <SidebarMenuButton className="w-full justify-between">
              Direct Messages
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  directMessagesOpen ? 'rotate-180 transform' : ''
                }`}
              />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenu>
              {isLoadingUsers ? (
                <SidebarMenuItem>
                  <SidebarMenuButton disabled>
                    Loading users...
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ) : users?.map((user) => (
                <SidebarMenuItem key={user.id}>
                  <Link href={`/dm/${user.id}`} passHref legacyBehavior>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === `/dm/${user.id}`}
                    >
                      <a className="flex items-center gap-2">
                        <div className="relative">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={user.imageURL || undefined} alt={user.username} />
                            <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <PresenceIndicator isActive={activeUsers?.includes(user.id)} />
                        </div>
                        {user.username}
                      </a>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </CollapsibleContent>
        </Collapsible>
      </SidebarContent>
    </Sidebar>
  )
}


'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, Hash, User } from 'lucide-react'
import { useUsers } from '@/hooks/use-users'

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

const channels = [
  { name: 'General', icon: Hash, href: '/general' },
]

export function AppSidebar() {
  const pathname = usePathname()
  const [channelsOpen, setChannelsOpen] = React.useState(true)
  const [directMessagesOpen, setDirectMessagesOpen] = React.useState(true)
  const { data: users, isLoading } = useUsers()

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
          <CollapsibleTrigger asChild>
            <SidebarMenuButton className="w-full justify-between">
              Channels
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  channelsOpen ? 'rotate-180 transform' : ''
                }`}
              />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenu>
              {channels.map((channel) => (
                <SidebarMenuItem key={channel.name}>
                  <Link href={channel.href} passHref legacyBehavior>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === channel.href}
                    >
                      <a>
                        <channel.icon className="mr-2 h-4 w-4" />
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
              {isLoading ? (
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
                      <a>
                        <User className="mr-2 h-4 w-4" />
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


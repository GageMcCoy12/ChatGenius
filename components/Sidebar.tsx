'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, Hash, MessageSquare, User } from 'lucide-react'

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
  { name: 'Social', icon: Hash, href: '/social' },
  { name: 'Help', icon: Hash, href: '/help' },
]

const directMessages = [
  { name: 'Alice', icon: User, href: '/dm/alice' },
  { name: 'Bob', icon: User, href: '/dm/bob' },
  { name: 'Charlie', icon: User, href: '/dm/charlie' },
]

export function AppSidebar() {
  const pathname = usePathname()
  const [channelsOpen, setChannelsOpen] = React.useState(true)
  const [directMessagesOpen, setDirectMessagesOpen] = React.useState(true)

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
              {directMessages.map((dm) => (
                <SidebarMenuItem key={dm.name}>
                  <Link href={dm.href} passHref legacyBehavior>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === dm.href}
                    >
                      <a>
                        <dm.icon className="mr-2 h-4 w-4" />
                        {dm.name}
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


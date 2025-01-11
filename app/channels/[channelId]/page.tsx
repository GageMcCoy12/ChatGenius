'use client'

import { use } from 'react'
import { CurrentMessageList } from '../../../components/ui/current-message-list'
import { useSidebarState } from '../../../hooks/use-sidebar-state'

export default function ChannelPage({ params }: { params: Promise<{ channelId: string }> }) {
  const resolvedParams = use(params)
  const { isCollapsed } = useSidebarState()
  
  return (
    <div className="flex flex-col h-full bg-[#1a1f2e] pb-32">
      <div className="flex-1 overflow-hidden">
        <CurrentMessageList 
          sidebarCollapsed={isCollapsed} 
          channelId={resolvedParams.channelId}
        />
      </div>
    </div>
  )
} 
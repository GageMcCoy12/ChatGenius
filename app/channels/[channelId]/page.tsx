'use client'

import { use, useState } from 'react'
import { CurrentMessageList } from '../../../components/ui/current-message-list'
import { useSidebarState } from '../../../hooks/use-sidebar-state'
import { ThreadView } from '@/components/ui/thread-view'
import { Message, User, Reaction } from '@prisma/client'

interface MessageWithDetails extends Message {
  user: User;
  reactions: Reaction[];
  fileUrl: string | null;
  fileName: string | null;
  fileType: string | null;
}

export default function ChannelPage({ params }: { params: Promise<{ channelId: string }> }) {
  const resolvedParams = use(params)
  const { isCollapsed } = useSidebarState()
  const [threadMessage, setThreadMessage] = useState<MessageWithDetails | null>(null)
  
  return (
    <div className="flex flex-col h-full bg-[#1a1f2e] pb-32">
      <div className="flex-1 overflow-hidden">
        <CurrentMessageList 
          sidebarCollapsed={isCollapsed} 
          channelId={resolvedParams.channelId}
          onThreadOpen={setThreadMessage}
        />
      </div>
      {threadMessage && (
        <ThreadView
          parentMessage={threadMessage}
          isOpen={!!threadMessage}
          onClose={() => setThreadMessage(null)}
        />
      )}
    </div>
  )
} 
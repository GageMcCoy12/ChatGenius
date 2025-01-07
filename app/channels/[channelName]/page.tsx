'use client'

import { use } from 'react'
import { Chat } from '@/components/Chat'

export default function ChannelPage({ params }: { params: Promise<{ channelName: string }> }) {
  const resolvedParams = use(params);
  
  return (
    <div className="flex flex-col h-full pt-16">
      <div className="flex-grow">
        <Chat channelId={resolvedParams.channelName} />
      </div>
    </div>
  )
} 
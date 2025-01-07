'use client'

import { Chat } from '@/components/Chat'

export default function GeneralPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow">
        <Chat channelId="general" />
      </div>
    </div>
  )
}


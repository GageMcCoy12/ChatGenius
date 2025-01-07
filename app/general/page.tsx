'use client'

import { useState } from 'react'
import { MessageInput } from '@/components/MessageInput'
import { format } from 'date-fns'

export default function GeneralPage() {
  const [messages, setMessages] = useState<Array<{ text: string; timestamp: Date }>>([])

  const handleSendMessage = (message: string, timestamp: Date) => {
    setMessages((prevMessages) => [...prevMessages, { text: message, timestamp }])
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow p-6 overflow-auto">
        {/* Removed h1 tag as per update 1 */}
        <p className="mb-4">Welcome to the general discussion channel. Here you can talk about anything related to our community.</p> {/* Updated paragraph as per update 2 */}
        <div className="space-y-2">
          {messages.map((msg, index) => (
            <div key={index} className="bg-muted p-2 rounded-md">
              <p>{msg.text}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Sent: {format(msg.timestamp, 'HH:mm:ss')}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 border-t">
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  )
}


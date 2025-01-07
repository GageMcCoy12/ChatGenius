'use client'

import { useState } from 'react'
import { MessageInput } from '@/components/MessageInput'
import { format } from 'date-fns'

export default function SocialPage() {
  const [messages, setMessages] = useState<Array<{ text: string; timestamp: Date }>>([])

  const handleSendMessage = (message: string, timestamp: Date) => {
    setMessages((prevMessages) => [...prevMessages, { text: message, timestamp }])
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow p-6 overflow-auto">
        <p className="mb-4">This is the place for casual conversations, sharing interesting finds, and getting to know your fellow community members.</p>
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


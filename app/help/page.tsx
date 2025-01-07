'use client'

import { useState } from 'react'
import { MessageInput } from '@/components/MessageInput'
import { format } from 'date-fns'

export default function HelpPage() {
  const [messages, setMessages] = useState<Array<{ text: string; timestamp: Date }>>([])

  const handleSendMessage = (message: string, timestamp: Date) => {
    setMessages((prevMessages) => [...prevMessages, { text: message, timestamp }])
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow p-6 overflow-auto">
        {/* <h1 className="text-2xl font-bold mb-4">Help Channel</h1> */}
        <p className="mb-4">Need assistance? You're in the right place. Ask your questions here, and our community members will be happy to help.</p>
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


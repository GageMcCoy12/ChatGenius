'use client'

import { useState } from 'react'
import { MessageInput } from '@/components/MessageInput'
import { Message } from '@/components/Message'

interface MessageType {
  text: string;
  timestamp: Date;
  user: {
    imageUrl: string;
    username: string;
    fullName: string;
  };
}

export default function GeneralPage() {
  const [messages, setMessages] = useState<MessageType[]>([])

  const handleSendMessage = (message: string, timestamp: Date, user: MessageType['user']) => {
    setMessages((prevMessages) => [...prevMessages, { text: message, timestamp, user }])
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow p-6 overflow-auto">
        <p className="mb-4">Welcome to the general discussion channel. Here you can talk about anything related to our community.</p>
        <div className="space-y-6">
          {messages.map((msg, index) => (
            <Message
              key={index}
              text={msg.text}
              timestamp={msg.timestamp}
              user={msg.user}
            />
          ))}
        </div>
      </div>
      <div className="p-4 border-t">
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  )
}


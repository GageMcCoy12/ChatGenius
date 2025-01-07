'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send } from 'lucide-react'
import { useUser } from '@clerk/nextjs'

interface MessageInputProps {
  onSendMessage: (message: string, timestamp: Date, user: {
    imageUrl: string;
    username: string;
    fullName: string;
  }) => void
}

export function MessageInput({ onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState('')
  const { user } = useUser()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && user) {
      onSendMessage(message, new Date(), {
        imageUrl: user.imageUrl,
        username: user.username || user.primaryEmailAddress?.emailAddress?.split('@')[0] || 'user',
        fullName: user.fullName || '',
      })
      setMessage('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <Input
        type="text"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-grow"
      />
      <Button type="submit" size="icon">
        <Send className="h-4 w-4" />
        <span className="sr-only">Send message</span>
      </Button>
    </form>
  )
}


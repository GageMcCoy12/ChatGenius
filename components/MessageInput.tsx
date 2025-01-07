'use client'

import { useState, FormEvent, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Send } from 'lucide-react'
import { Message } from '@/types/messages'

interface MessageInputProps {
  onSend: (text: string) => Promise<Message>
  isLoading?: boolean
}

export const MessageInput = ({ onSend, isLoading }: MessageInputProps) => {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }

  useEffect(() => {
    adjustTextareaHeight()
  }, [message])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isLoading) return

    try {
      await onSend(message)
      setMessage('')
      // Reset height after sending
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="fixed bottom-0 left-[240px] right-0 border-t bg-background">
      <div className="flex gap-2 px-8 py-4 max-w-[2000px] mx-auto">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="min-h-[40px] max-h-[200px] resize-none flex-1"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSubmit(e)
            }
          }}
          rows={1}
        />
        <Button type="submit" disabled={isLoading || !message.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}


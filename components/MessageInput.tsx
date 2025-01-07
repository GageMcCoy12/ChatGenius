'use client'

import { useState, FormEvent, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Send, Paperclip, Bold, Italic, Underline } from 'lucide-react'
import { Message } from '@/types/messages'
import { FileUpload } from './FileUpload'
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"
import ReactMarkdown from 'react-markdown'

interface MessageInputProps {
  onSend: (params: { text: string; fileUrl?: string }) => Promise<Message>
  isLoading?: boolean
}

export const MessageInput = ({ onSend, isLoading }: MessageInputProps) => {
  const [message, setMessage] = useState('')
  const [displayMessage, setDisplayMessage] = useState('')
  const [fileUrl, setFileUrl] = useState('')
  const [activeFormats, setActiveFormats] = useState<string[]>([])
  const [selection, setSelection] = useState<{ start: number; end: number } | null>(null)
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
  }, [displayMessage])

  const handleSelectionChange = () => {
    const textarea = textareaRef.current
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      if (start !== end) {
        setSelection({ start, end })
      } else {
        setSelection(null)
      }
    }
  }

  const applyFormatting = (format: string) => {
    if (!selection) return

    let formatMarker = ''
    switch (format) {
      case 'bold':
        formatMarker = '**'
        break
      case 'italic':
        formatMarker = '*'
        break
      case 'underline':
        formatMarker = '__'
        break
    }

    const before = message.substring(0, selection.start)
    const selected = message.substring(selection.start, selection.end)
    const after = message.substring(selection.end)

    const newMessage = `${before}${formatMarker}${selected}${formatMarker}${after}`
    setMessage(newMessage)
    updateDisplayMessage(newMessage)

    // Reset selection and update cursor position
    if (textareaRef.current) {
      const newPosition = selection.start + selected.length
      setTimeout(() => {
        textareaRef.current?.setSelectionRange(newPosition, newPosition)
      }, 0)
    }
  }

  const updateDisplayMessage = (msg: string) => {
    // Convert markdown to HTML classes
    let displayText = msg
    displayText = displayText.replace(/\*\*(.*?)\*\*/g, '<span class="font-bold">$1</span>')
    displayText = displayText.replace(/\*(.*?)\*/g, '<span class="italic">$1</span>')
    displayText = displayText.replace(/__(.*?)__/g, '<span class="underline">$1</span>')
    setDisplayMessage(displayText)
  }

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMessage = e.target.value
    setMessage(newMessage)
    updateDisplayMessage(newMessage)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if ((!message.trim() && !fileUrl) || isLoading) return

    try {
      await onSend({ text: message, fileUrl })
      setMessage('')
      setDisplayMessage('')
      setFileUrl('')
      setActiveFormats([])
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const handleFileChange = (url?: string) => {
    setFileUrl(url || '')
  }

  return (
    <form onSubmit={handleSubmit} className="fixed bottom-0 left-[255px] right-0 bg-background border-t z-1">
      <div className="px-8 py-4">
        {fileUrl && (
          <div className="mb-4">
            <FileUpload
              value={fileUrl}
              onChange={handleFileChange}
              messageId="temp"
            />
          </div>
        )}
        <div className="flex flex-col gap-2">
          <ToggleGroup type="multiple" value={activeFormats} onValueChange={(value) => {
            setActiveFormats(value)
            const lastFormat = value[value.length - 1]
            if (lastFormat && selection) {
              applyFormatting(lastFormat)
            }
          }} className="justify-start">
            <ToggleGroupItem value="bold" aria-label="Toggle bold">
              <Bold className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Toggle italic">
              <Italic className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Toggle underline">
              <Underline className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={handleMessageChange}
                onSelect={handleSelectionChange}
                placeholder="Type a message..."
                className="opacity-0 absolute inset-0 resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e)
                  }
                }}
                rows={1}
              />
              <div 
                className="min-h-[40px] max-h-[200px] p-3 rounded-md border bg-background text-sm"
                dangerouslySetInnerHTML={{ __html: displayMessage || 'Type a message...' }}
              />
            </div>
            <div className="flex-shrink-0 flex gap-2">
              {!fileUrl && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                >
                  <div className="relative">
                    <Paperclip className="h-4 w-4" />
                    <div className="absolute inset-0">
                      <FileUpload
                        value={fileUrl}
                        onChange={handleFileChange}
                        messageId="temp"
                      />
                    </div>
                  </div>
                </Button>
              )}
              <Button 
                type="submit" 
                size="icon"
                disabled={isLoading || (!message.trim() && !fileUrl)}
                className="h-10 w-10"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}


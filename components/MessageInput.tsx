/**
 * MessageInput Component
 * 
 * A rich text input component for sending messages with support for:
 * - Text formatting (bold, italic, underline)
 * - File attachments
 * - Message replies
 * - Real-time cursor position tracking
 * 
 * @component
 * @example
 * ```tsx
 * <MessageInput 
 *   onSend={handleSend} 
 *   isLoading={false}
 *   replyTo={replyMessage}
 *   onCancelReply={() => setReplyMessage(null)}
 * />
 * ```
 */

'use client'

import { useState, FormEvent, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Send, Paperclip, Bold, Italic, Underline } from 'lucide-react'
import { Message } from '@/types/messages'
import { FileUpload } from './FileUpload'
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { MessageReply } from './MessageReply'

interface MessageInputProps {
  /** Callback function when a message is sent */
  onSend: (params: { text: string; fileUrl?: string; replyToId?: string }) => Promise<Message>
  /** Loading state to disable input */
  isLoading?: boolean
  /** Message being replied to */
  replyTo?: Message
  /** Callback to cancel reply */
  onCancelReply?: () => void
  /** Placeholder text for the input */
  placeholder?: string
}

export const MessageInput = ({ 
  onSend, 
  isLoading, 
  replyTo, 
  onCancelReply,
  placeholder = "Type a message..." 
}: MessageInputProps) => {
  // State for managing the input content
  const [message, setMessage] = useState('')
  const [displayMessage, setDisplayMessage] = useState('')
  const [cursorPosition, setCursorPosition] = useState(0)
  const [fileUrl, setFileUrl] = useState('')
  const [activeFormats, setActiveFormats] = useState<string[]>([])
  const [selection, setSelection] = useState<{ start: number; end: number } | null>(null)
  
  // Refs for DOM manipulation
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const isSubmitting = useRef(false)

  /** Adjusts textarea height based on content */
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }

  // Cleanup on unmount or channel change
  useEffect(() => {
    adjustTextareaHeight()
    return () => {
      setMessage('')
      setDisplayMessage('')
      setFileUrl('')
      setActiveFormats([])
      isSubmitting.current = false
    }
  }, [])

  /** Updates cursor position and selection state */
  const handleSelectionChange = () => {
    const textarea = textareaRef.current
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      setCursorPosition(start)
      setSelection(start !== end ? { start, end } : null)
    }
  }

  /** Applies markdown formatting to selected text */
  const applyFormatting = (format: string) => {
    if (!selection) return

    const formatMarkers = {
      bold: '**',
      italic: '*',
      underline: '__'
    }

    const marker = formatMarkers[format as keyof typeof formatMarkers]
    const before = message.substring(0, selection.start)
    const selected = message.substring(selection.start, selection.end)
    const after = message.substring(selection.end)

    const newMessage = `${before}${marker}${selected}${marker}${after}`
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

  /** Converts markdown to HTML and adds cursor */
  const updateDisplayMessage = (msg: string) => {
    let displayText = msg
    displayText = displayText.replace(/\*\*(.*?)\*\*/g, '<span class="font-bold">$1</span>')
    displayText = displayText.replace(/\*(.*?)\*/g, '<span class="italic">$1</span>')
    displayText = displayText.replace(/__(.*?)__/g, '<span class="underline">$1</span>')
    
    if (cursorPosition >= 0 && cursorPosition <= msg.length) {
      const beforeCursor = displayText.slice(0, cursorPosition)
      const afterCursor = displayText.slice(cursorPosition)
      displayText = `${beforeCursor}<span class="relative"><span class="absolute top-0 -right-[2px] h-full w-0.5 bg-primary animate-caret"></span></span>${afterCursor}`
    }
    
    setDisplayMessage(displayText)
  }

  /** Handles message input changes */
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMessage = e.target.value
    setMessage(newMessage)
    updateDisplayMessage(newMessage)
  }

  // Update display when cursor position changes
  useEffect(() => {
    updateDisplayMessage(message)
  }, [cursorPosition, message])

  /** Handles message submission */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if ((!message.trim() && !fileUrl) || isLoading || isSubmitting.current) return

    isSubmitting.current = true
    const currentMessage = message
    const currentFileUrl = fileUrl

    try {
      await onSend({ 
        text: currentMessage, 
        fileUrl: currentFileUrl,
        replyToId: replyTo?.id
      })
      setMessage('')
      setDisplayMessage('')
      setFileUrl('')
      setActiveFormats([])
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
      if (onCancelReply) {
        onCancelReply()
      }
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      isSubmitting.current = false
    }
  }

  /** Handles file upload changes */
  const handleFileChange = (url?: string) => {
    setFileUrl(url || '')
  }

  /** Handles keyboard shortcuts */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="fixed bottom-0 left-[255px] right-0 bg-background border-t z-1">
      <div className="px-8 py-4">
        {replyTo && (
          <div className="mb-4">
            <MessageReply replyTo={replyTo} onCancelReply={onCancelReply || (() => {})} />
          </div>
        )}
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
          <ToggleGroup 
            type="multiple" 
            value={activeFormats} 
            onValueChange={(value) => {
              setActiveFormats(value)
              const lastFormat = value[value.length - 1]
              if (lastFormat && selection) {
                applyFormatting(lastFormat)
              }
            }} 
            className="justify-start"
          >
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
                onKeyDown={handleKeyDown}
                onClick={handleSelectionChange}
                placeholder={placeholder}
                className="opacity-0 absolute inset-0 resize-none"
                rows={1}
              />
              <div 
                className="min-h-[40px] max-h-[200px] p-3 rounded-md border bg-background text-sm"
                dangerouslySetInnerHTML={{ __html: displayMessage || `<span class="text-muted-foreground">${placeholder}</span>` }}
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


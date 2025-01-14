"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useQueryClient } from "@tanstack/react-query"
import { Bold, Italic, Underline, Upload, X } from "lucide-react"
import Image from "next/image"
import { useUploadThing } from "@/lib/uploadthing"
import { useToast } from "@/components/ui/use-toast"
import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { Switch } from "./switch"

interface CurrentMessageInputProps {
  sidebarCollapsed: boolean;
  channelId: string;
  replyId?: string;
  placeholder?: string;
}

interface ImagePreview {
  url: string
  previewUrl: string
  name: string
  type: string
}

// Helper function to match core.ts logging
const logStage = (stage: string, data?: any) => {
  console.log(`\n=== UploadThing ${stage} ===`);
  if (data) console.log(JSON.stringify(data, null, 2));
  console.log("========================\n");
};

function formatMessageContent(content: string) {
  return content
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/_(.*?)_/g, '<em>$1</em>')
    // Underline
    .replace(/__(.*?)__/g, '<span class="underline">$1</span>')
}

export function CurrentMessageInput({
  sidebarCollapsed,
  channelId,
  replyId,
  placeholder = "Type a message..."
}: CurrentMessageInputProps) {
  const router = useRouter()
  const { user } = useUser()
  const [content, setContent] = useState("")
  const [selectedImage, setSelectedImage] = useState<ImagePreview | null>(null)
  const [isAIEnabled, setIsAIEnabled] = React.useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const queryClient = useQueryClient()
  const { toast } = useToast()
  
  // Get other user's name if this is a DM channel
  const { data: channel } = useQuery({
    queryKey: ['channel', channelId],
    queryFn: async () => {
      const response = await fetch(`/api/channels/resolve?channelId=${channelId}`)
      if (!response.ok) throw new Error('Failed to fetch channel')
      return response.json()
    }
  })

  const isDM = channelId.startsWith('dm-')
  const otherUserName = isDM ? channel?.name.split(', ').find((name: string) => name !== channel?.currentUserName) : null

  const { startUpload, isUploading } = useUploadThing("messageAttachment", {
    onClientUploadComplete: (res) => {
      if (!res?.[0]) return;
      
      const uploadedFile = res[0];
      logStage("Client Upload Complete", uploadedFile);
      
      setSelectedImage(prev => prev ? {
        ...prev,
        url: uploadedFile.url,
        name: uploadedFile.name
      } : null);
    },
    onUploadError: (error: Error) => {
      logStage("Upload Error", error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload file",
        variant: "destructive",
      });
      if (selectedImage?.previewUrl) {
        URL.revokeObjectURL(selectedImage.previewUrl);
      }
      setSelectedImage(null);
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview using local URL immediately
    const localPreviewUrl = URL.createObjectURL(file);
    setSelectedImage({
      url: "", // We'll update this with the real URL after upload
      previewUrl: localPreviewUrl,
      name: file.name,
      type: file.type
    });

    // Start upload - state managed by useUploadThing
    startUpload([file]);
  };

  const formatText = (format: 'bold' | 'italic' | 'underline') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    let formattedText = ''
    let cursorOffset = 0

    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`
        cursorOffset = 2
        break
      case 'italic':
        formattedText = `_${selectedText}_`
        cursorOffset = 1
        break
      case 'underline':
        formattedText = `__${selectedText}__`
        cursorOffset = 2
        break
    }

    const newContent = content.substring(0, start) + formattedText + content.substring(end)
    setContent(newContent)

    // Set cursor position after formatting
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(
        start + cursorOffset,
        end + cursorOffset
      )
    }, 0)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1a1f2e] border-t border-[#2a3142] p-4 transition-all duration-300"
      style={{
        left: sidebarCollapsed ? "1rem" : "20%",
      }}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-zinc-400 hover:text-zinc-200"
              onClick={() => formatText('bold')}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-zinc-400 hover:text-zinc-200"
              onClick={() => formatText('italic')}
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-zinc-400 hover:text-zinc-200"
              onClick={() => formatText('underline')}
            >
              <Underline className="h-4 w-4" />
            </Button>
            <label className="cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                onChange={handleFileUpload}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-zinc-400 hover:text-zinc-200"
                asChild
              >
                <span>
                  <Upload className="h-4 w-4" />
                </span>
              </Button>
            </label>
          </div>

          {isDM && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#8ba3d4]">
                Ask {otherUserName}'s AI Agent
              </span>
              <Switch
                checked={isAIEnabled}
                onCheckedChange={setIsAIEnabled}
                className="data-[state=checked]:bg-[#3d4663]"
              />
            </div>
          )}
        </div>

        <Textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="resize-none bg-[#242b3d] border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-200 placeholder:text-zinc-400"
        />
      </div>
    </div>
  )
} 
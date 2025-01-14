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

interface CurrentMessageInputProps {
  sidebarCollapsed?: boolean;
  channelId: string;
  replyToId?: string;
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
  sidebarCollapsed = false,
  channelId,
  replyToId,
  placeholder = "Type a message..."
}: CurrentMessageInputProps) {
  const router = useRouter()
  const { user } = useUser()
  const [content, setContent] = useState("")
  const [selectedImage, setSelectedImage] = useState<ImagePreview | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const queryClient = useQueryClient()
  const { toast } = useToast()
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

  const removeSelectedImage = () => {
    if (selectedImage?.previewUrl) {
      URL.revokeObjectURL(selectedImage.previewUrl);
    }
    setSelectedImage(null);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if ((!content.trim() && !selectedImage) || !user) return;
    if (isUploading) {
      toast({
        title: "Please wait",
        description: "File is still uploading...",
        variant: "default",
      });
      return;
    }

    console.log("Submitting message with replyToId:", replyToId);
    
    // Ensure we have the complete file information before sending
    if (selectedImage && !selectedImage.url) {
      toast({
        title: "Upload incomplete",
        description: "Please wait for the file to finish uploading",
        variant: "default",
      });
      return;
    }

    try {
      const payload = {
        content: content.trim(),
        channelId,
        replyToId,
        ...(selectedImage && selectedImage.url && { 
          fileUrl: selectedImage.url,
          fileName: selectedImage.name,
          fileType: selectedImage.type
        })
      };

      console.log("Sending payload:", payload);

      const response = await fetch("/api/channels/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(await response.text() || "Failed to send message");
      }

      // Clean up
      if (selectedImage?.previewUrl) {
        URL.revokeObjectURL(selectedImage.previewUrl);
      }
      setContent("");
      setSelectedImage(null);
      
      // Invalidate both channel messages and thread messages
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['messages', channelId]
        }),
        replyToId && queryClient.invalidateQueries({
          queryKey: ['thread', replyToId]
        })
      ]);
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    }
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

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSubmit(e as any)
    }
  }

  return (
    <div className={cn(
      "fixed bottom-0 right-0 p-4 transition-all duration-300 bg-[#1a1f2e] border-t border-[#2a3142] shadow-lg z-10",
      sidebarCollapsed ? "left-2" : "left-[20%]"
    )}>
      <form onSubmit={onSubmit} className="relative">
        <div className="flex flex-col gap-2 bg-[#1e2330]">
          {selectedImage && (
            <div className="relative w-48 h-48 mx-2">
              <Image
                src={selectedImage.previewUrl}
                alt="Preview"
                fill
                className="object-cover rounded-md"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 bg-zinc-800/50 hover:bg-zinc-800 text-zinc-400"
                onClick={removeSelectedImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          <div className="flex items-center gap-2 px-2 bg-[#1e2330]">
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
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            rows={3}
            className="resize-none bg-[#242b3d] border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-200 placeholder:text-zinc-400"
          />
        </div>
      </form>
    </div>
  )
} 
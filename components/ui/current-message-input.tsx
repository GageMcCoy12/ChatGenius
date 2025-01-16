"use client"

import { useState, useRef, useMemo } from "react"
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

function getFileType(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) return 'image';
  if (['mp4', 'webm', 'ogg'].includes(extension)) return 'video';
  if (['pdf'].includes(extension)) return 'pdf';
  if (['doc', 'docx'].includes(extension)) return 'document';
  return 'unknown';
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
  
  // Check if this is a DM channel
  const isDM = channelId?.startsWith('dm-');

  // Get channel data
  const { data: channel, isLoading: isChannelLoading } = useQuery({
    queryKey: ['channel', channelId],
    queryFn: async () => {
      if (!channelId) return null;
      const response = await fetch(`/api/channels/resolve?channelId=${channelId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch channel');
      }
      return response.json();
    },
    enabled: !!channelId,
  });

  // For DM channels, get the other user's name
  const otherUserName = useMemo(() => {
    if (!isDM || !channel?.name) return '';
    const names = channel.name.split(', ');
    return names.find((name: string) => name !== user?.username) || '';
  }, [isDM, channel?.name, user?.username]);

  const { startUpload, isUploading } = useUploadThing("messageAttachment", {
    onClientUploadComplete: (res) => {
      if (!res?.[0]) return;
      
      const uploadedFile = res[0];
      logStage("Client Upload Complete", uploadedFile);

      // Map the UploadThing response to our expected format
      const fileUrl = `https://uploadthing.com/f/${uploadedFile.key}`;
      
      setSelectedImage({
        url: fileUrl,
        previewUrl: selectedImage?.previewUrl || fileUrl,
        name: uploadedFile.name,
        type: getFileType(uploadedFile.name)
      });

      toast({
        title: "Upload successful",
        description: "Your file has been uploaded successfully.",
      });
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

    // Validate file size (16MB limit)
    const MAX_SIZE = 16 * 1024 * 1024; // 16MB in bytes
    if (file.size > MAX_SIZE) {
      toast({
        title: "File too large",
        description: "Maximum file size is 16MB",
        variant: "destructive",
      });
      return;
    }

    // Show preview using local URL immediately
    const localPreviewUrl = URL.createObjectURL(file);
    setSelectedImage({
      url: "", // We'll update this with the real URL after upload
      previewUrl: localPreviewUrl,
      name: file.name,
      type: file.type
    });

    try {
      // Start upload - state managed by useUploadThing
      await startUpload([file]);
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "An error occurred while uploading your file",
        variant: "destructive",
      });
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
      }
      setSelectedImage(null);
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

  const handleSubmit = async () => {
    if ((!content.trim() && !selectedImage?.url) || !user) return;

    try {
      const formattedContent = content ? formatMessageContent(content) : "";
      
      // If AI is enabled and this is a DM, send to AI endpoint
      if (isAIEnabled && isDM) {
        const aiResponse = await fetch('/api/messages/ai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: formattedContent,
            channelId,
            fileUrl: selectedImage?.url,
            fileName: selectedImage?.name,
            fileType: selectedImage?.type,
          }),
        });

        if (!aiResponse.ok) {
          throw new Error('Failed to get AI response');
        }

        // Clear the input after successful AI message
        setContent("");
        if (selectedImage?.previewUrl) {
          URL.revokeObjectURL(selectedImage.previewUrl);
          setSelectedImage(null);
        }
        return;
      }

      // Regular message sending logic
      const response = await fetch('/api/channels/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: formattedContent || "Shared a file", // Default message if only file is shared
          channelId,
          replyToId: replyId,
          fileUrl: selectedImage?.url,
          fileName: selectedImage?.name,
          fileType: selectedImage?.type,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to send message');
      }

      // Clear inputs after successful send
      setContent("");
      if (selectedImage?.previewUrl) {
        URL.revokeObjectURL(selectedImage.previewUrl);
        setSelectedImage(null);
      }
      
      // Refetch messages to update the UI
      queryClient.invalidateQueries({
        queryKey: ['messages', channelId]
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Failed to send message",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // If channel is loading or channelId is missing, show loading state
  if (isChannelLoading || !channelId) {
    return (
      <div className={cn(
        "fixed bottom-0 right-0 h-32 bg-[#1a1f2e] border-t border-[#2a3142] transition-all duration-300",
        sidebarCollapsed ? "left-2" : "left-[20%]"
      )}>
        <div className="animate-pulse p-4">
          <div className="h-24 bg-[#242b3d] rounded-md" />
        </div>
      </div>
    );
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

        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isAIEnabled && isDM ? `Ask ${otherUserName} a question...` : placeholder}
            rows={3}
            className="resize-none bg-[#242b3d] border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-200 placeholder:text-zinc-400"
          />
          {selectedImage && (
            <div className="absolute bottom-full left-0 mb-2 p-2 bg-[#242b3d] rounded-md">
              <div className="relative">
                <Image
                  src={selectedImage.previewUrl}
                  alt="Upload preview"
                  width={100}
                  height={100}
                  className="rounded-md"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 hover:bg-red-600 rounded-full"
                  onClick={() => {
                    if (selectedImage.previewUrl) {
                      URL.revokeObjectURL(selectedImage.previewUrl);
                    }
                    setSelectedImage(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 
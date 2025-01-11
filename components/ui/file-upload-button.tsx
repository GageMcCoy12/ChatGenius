"use client"

import * as React from "react"
import { Paperclip } from "lucide-react"
import { uploadToS3 } from "@/lib/s3-upload"

interface FileUploadButtonProps {
  onChange: (url: string) => void
  disabled?: boolean
}

export function FileUploadButton({ onChange, disabled }: FileUploadButtonProps) {
  const [isUploading, setIsUploading] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      const { url } = await uploadToS3(file)
      onChange(url)
    } catch (error) {
      console.error("Failed to upload file:", error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
      />
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || isUploading}
        className="p-1.5 rounded hover:bg-[#242b3d] text-[#8ba3d4] transition-colors disabled:opacity-50"
      >
        <Paperclip className="h-4 w-4" />
      </button>
    </>
  )
} 
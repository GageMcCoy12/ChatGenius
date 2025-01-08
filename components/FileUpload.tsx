'use client';

import { useState } from 'react';
import { UploadButton } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { FileIcon, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { z } from "zod";

interface FileUploadProps {
  onChange: (url?: string) => void;
  value: string;
  messageId: string;
}

const inputSchema = z.object({ messageId: z.string() });

export const FileUpload = ({
  onChange,
  value,
  messageId
}: FileUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileType = value?.split('.').pop();

  if (value && fileType) {
    return (
      <div className="relative h-20 w-20">
        {fileType === 'pdf' ? (
          <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
            <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
            <a 
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
            >
              PDF File
            </a>
          </div>
        ) : (
          <Image
            fill
            src={value}
            alt="Upload"
            className="rounded-full"
          />
        )}
        <button
          onClick={() => onChange("")}
          className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-10 h-10 overflow-hidden">
        <UploadButton<OurFileRouter, "messageAttachment">
          endpoint="messageAttachment"
          input={{ messageId }}
          onUploadBegin={() => {
            setIsUploading(true);
          }}
          onClientUploadComplete={(res) => {
            setIsUploading(false);
            if (res?.[0]) {
              onChange(res[0].url);
              toast.success('File uploaded successfully');
            }
          }}
          onUploadError={(error: Error) => {
            setIsUploading(false);
            toast.error('Failed to upload file');
            console.error(error);
          }}
          className="ut-button:bg-transparent ut-button:border-0 ut-button:w-10 ut-button:h-10 ut-button:p-0 ut-button:m-0 ut-allowed-content:hidden ut-button:text-[0px] ut-button:text-transparent ut-button:before:content-none ut-button:overflow-hidden"
        />
        {isUploading && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/50 rounded-md">
            <div className="text-sm text-white">
              Uploading...
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 
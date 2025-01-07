import { FileIcon, ImageIcon, Download } from "lucide-react";
import Image from "next/image";
import type { MessageAttachment as MessageAttachmentType } from "@/types/messages";
import { Button } from "@/components/ui/button";

interface MessageAttachmentProps {
  attachment: MessageAttachmentType;
}

export function MessageAttachment({ attachment }: MessageAttachmentProps) {
  const isPDF = attachment.fileType === 'application/pdf';
  const isImage = attachment.fileType.startsWith('image/');

  const handleDownload = async () => {
    try {
      const response = await fetch(attachment.fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = attachment.fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download file:', error);
    }
  };

  if (isImage) {
    return (
      <div className="relative group">
        <div className="relative h-48 w-48 rounded-lg overflow-hidden">
          <Image
            src={attachment.fileUrl}
            alt={attachment.fileName}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-white hover:text-white hover:bg-white/20"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isPDF) {
    return (
      <div className="flex items-center gap-2 p-2 rounded-lg bg-background/10 group">
        <a
          href={attachment.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 flex-1"
        >
          <FileIcon className="h-8 w-8 text-primary" />
          <div className="flex flex-col">
            <span className="text-sm font-medium">{attachment.fileName}</span>
            <span className="text-xs text-muted-foreground">PDF Document</span>
          </div>
        </a>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleDownload}
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return null;
} 
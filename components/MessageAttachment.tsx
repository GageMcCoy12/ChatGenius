/**
 * MessageAttachment Component
 * 
 * Displays file attachments in messages, supporting:
 * - Images
 * - PDFs (with iframe preview)
 * 
 * @component
 * @example
 * ```tsx
 * <MessageAttachment fileUrl="https://example.com/file.pdf" />
 * ```
 */

'use client';

import { useState } from 'react';
import { 
  FileIcon, 
  FileText, 
  FileImage, 
  FileArchive,
  Download,
  File,
  FileCode,
  FileAudio,
  FileVideo
} from 'lucide-react';
import { Button } from './ui/button';
import Image from 'next/image';

interface MessageAttachmentProps {
  fileUrl: string;
  fileName: string;
  fileSize: number;
  fileType: string;
}

const getFileIcon = (fileType: string) => {
  const type = fileType.toLowerCase();
  if (type.includes('pdf')) {
    return <FileText className="h-10 w-10 text-blue-500" />;
  }
  if (type.includes('zip') || type.includes('rar') || type.includes('7z')) {
    return <FileArchive className="h-10 w-10 text-purple-500" />;
  }
  if (type.startsWith('image/')) {
    return <FileImage className="h-10 w-10 text-green-500" />;
  }
  if (type.startsWith('video/')) {
    return <FileVideo className="h-10 w-10 text-red-500" />;
  }
  if (type.startsWith('audio/')) {
    return <FileAudio className="h-10 w-10 text-yellow-500" />;
  }
  if (type.includes('javascript') || type.includes('typescript') || type.includes('html') || type.includes('css')) {
    return <FileCode className="h-10 w-10 text-emerald-500" />;
  }
  return <File className="h-10 w-10 text-gray-500" />;
};

const formatFileSize = (bytes: number) => {
  if (!bytes) return '';
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

export function MessageAttachment({ fileUrl, fileName, fileSize, fileType }: MessageAttachmentProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  // Check both MIME type and file extension for images
  const isImage = fileType.startsWith('image/') || 
    /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName.toLowerCase());
  
  const isVideo = fileType.startsWith('video/');
  const isPDF = fileType.includes('pdf');
  const isDownloadable = true;

  const handleDownload = async () => {
    if (isLoading) return;
    setIsLoading(true);
    
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isImage) {
    return (
      <div className="relative max-w-sm group">
        <div className="relative w-full h-[300px]">
          <Image
            src={fileUrl}
            alt={fileName}
            fill
            className="rounded-md object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
          <Button
            variant="secondary"
            size="sm"
            className="gap-2"
            onClick={handleDownload}
            disabled={isLoading}
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
      </div>
    );
  }

  if (isVideo) {
    return (
      <div className="max-w-2xl">
        <div className="flex items-center gap-3 p-3 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors">
          <FileVideo className="h-10 w-10 text-red-500" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{fileName}</p>
            <p className="text-xs text-muted-foreground">{formatFileSize(fileSize)}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={handleDownload}
            disabled={isLoading}
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
        <video 
          controls 
          className="w-full rounded-md mt-2 max-h-[400px]"
          preload="metadata"
        >
          <source src={fileUrl} type={fileType} />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  if (isPDF) {
    return (
      <div className="max-w-2xl">
        <div className="flex items-center gap-3 p-3 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors">
          <FileText className="h-10 w-10 text-blue-500" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{fileName}</p>
            <p className="text-xs text-muted-foreground">{formatFileSize(fileSize)}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={handleDownload}
            disabled={isLoading}
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
        <iframe src={fileUrl} className="w-full h-[500px] rounded-md mt-2" />
      </div>
    );
  }

  return (
    <div className="max-w-sm flex items-center gap-3 p-3 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors">
      {getFileIcon(fileType)}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{fileName}</p>
        <p className="text-xs text-muted-foreground">{formatFileSize(fileSize)}</p>
      </div>
      {isDownloadable && (
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          onClick={handleDownload}
          disabled={isLoading}
        >
          <Download className="h-4 w-4" />
          Download
        </Button>
      )}
    </div>
  );
} 
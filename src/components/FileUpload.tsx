'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadToS3 } from '../lib/s3-upload';
import { cn } from '../../lib/utils';

interface FileUploadProps {
  onChange: (url: string) => void;
  value: string;
  disabled?: boolean;
}

export function FileUpload({
  onChange,
  value,
  disabled
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      setIsUploading(true);
      const file = acceptedFiles[0];
      
      const result = await uploadToS3(file);
      onChange(result.url);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: isUploading || disabled,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors',
        isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/20',
        disabled && 'opacity-50 cursor-default'
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center gap-2 text-xs text-muted-foreground">
        {isUploading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span>Uploading...</span>
          </div>
        ) : (
          <>
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <div className="text-center">
              <p className="font-medium">
                Click to upload or drag and drop
              </p>
              <p>
                Up to 10MB
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 
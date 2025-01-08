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

interface MessageAttachmentProps {
  /** URL of the file to display */
  fileUrl: string;
}

export function MessageAttachment({ fileUrl }: MessageAttachmentProps) {
  const isPDF = fileUrl.toLowerCase().endsWith('.pdf');

  return (
    <div className="max-w-sm">
      {isPDF ? (
        <iframe src={fileUrl} className="w-full h-[500px] rounded-md" />
      ) : (
        <img src={fileUrl} alt="Attachment" className="max-w-full rounded-md" />
      )}
    </div>
  );
} 
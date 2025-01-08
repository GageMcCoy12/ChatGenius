'use client';

import { useState, useEffect } from 'react';
import { Message } from '@/types/messages';
import { Button } from './ui/button';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { MessageBubble } from './MessageBubble';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMessages } from '@/hooks/use-messages';
import { pusherClient } from '@/lib/pusher';

interface MessageThreadProps {
  parentMessage: Message;
  onClose: () => void;
  className?: string;
}

export function MessageThread({ parentMessage, onClose, className }: MessageThreadProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(parentMessage);
  const { sendMessage } = useMessages(parentMessage.channelId);

  useEffect(() => {
    // Subscribe to thread updates
    const channel = pusherClient.subscribe(parentMessage.channelId);
    
    // Listen for new replies in this thread
    channel.bind(`thread-${parentMessage.id}`, (newReply: Message) => {
      setCurrentMessage(prev => ({
        ...prev,
        replies: [...(prev.replies || []), newReply],
        replyCount: (prev.replyCount || 0) + 1,
        lastReplyAt: new Date()
      }));
    });

    // Listen for parent message updates
    channel.bind('update-message', (updatedMessage: Message) => {
      if (updatedMessage.id === parentMessage.id) {
        setCurrentMessage(updatedMessage);
      }
    });

    return () => {
      channel.unbind(`thread-${parentMessage.id}`);
      channel.unbind('update-message');
      pusherClient.unsubscribe(parentMessage.channelId);
    };
  }, [parentMessage.id, parentMessage.channelId]);

  const handleSendReply = async ({ text, fileUrl }: { text: string; fileUrl?: string }) => {
    return await sendMessage({ text, fileUrl, replyToId: parentMessage.id });
  };

  return (
    <div className={cn(
      "fixed right-0 top-0 h-full w-[400px] bg-background border-l shadow-lg transition-all duration-200 ease-in-out",
      isCollapsed && "w-[50px]",
      className
    )}>
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className={cn("font-semibold", isCollapsed && "hidden")}>
          Thread
        </h3>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8"
          >
            {isCollapsed ? "←" : "→"}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {!isCollapsed && (
        <div className="flex flex-col h-[calc(100%-64px)]">
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 border-b bg-muted/10">
              <MessageBubble
                message={currentMessage}
                isThreadMessage={false}
              />
              <div className="mt-2 text-xs text-muted-foreground">
                {currentMessage.replyCount} {currentMessage.replyCount === 1 ? 'reply' : 'replies'} in thread
              </div>
            </div>
            <div className="p-4">
              <MessageList 
                messages={currentMessage.replies || []} 
                isThread={true}
              />
            </div>
          </div>
          <div className="p-4 border-t">
            <MessageInput
              onSend={handleSendReply}
              isLoading={false}
              placeholder="Reply in thread..."
            />
          </div>
        </div>
      )}
    </div>
  );
} 
'use client';

import { useMessages } from '@/hooks/use-messages';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useState, useEffect, useRef } from 'react';
import { Message } from '@/types/messages';

interface ChatProps {
  channelId: string;
}

interface LastMessage {
  text: string;
  timestamp: number;
}

interface LastSentMessage {
  text: string;
  timestamp: number;
}

export const Chat = ({ channelId }: ChatProps) => {
  const { messages, loading, error, sendMessage, refreshMessages, updateReactions } = useMessages(channelId);
  const [lastMessage, setLastMessage] = useState<LastMessage | null>(null);
  const [lastSentMessage, setLastSentMessage] = useState<LastSentMessage | null>(null);
  const activeChannelRef = useRef(channelId);
  const isSending = useRef(false);

  // Update active channel ref and reset state when channel changes
  useEffect(() => {
    activeChannelRef.current = channelId;
    setLastSentMessage(null);
    isSending.current = false;
    
    // Cleanup function
    return () => {
      isSending.current = false;
    };
  }, [channelId]);

  const handleSendMessage = async (message: { text: string; fileUrl?: string }) => {
    try {
      return await sendMessage(message);
    } catch (error) {
      if (error instanceof Error && error.message === 'Duplicate message') {
        // Silently ignore duplicate messages
        return;
      }
      console.error('Failed to send message:', error);
      throw error;
    }
  };

  const handleReactionsUpdate = async (messageId: string, reactions: Message['reactions']) => {
    try {
      await updateReactions(messageId, reactions);
    } catch (error) {
      console.error('Error updating reactions:', error);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col h-[calc(100vh-64px)] items-center justify-center p-4">
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error.toString()}</AlertDescription>
        </Alert>
        <button
          onClick={(e) => refreshMessages()}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ReloadIcon className="h-4 w-4" />
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] w-full relative">
      <div className="flex-1 overflow-y-auto pb-[80px]">
        <MessageList 
          messages={messages}
          onReactionsUpdate={handleReactionsUpdate}
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-background">
        <MessageInput
          onSend={handleSendMessage}
          isLoading={loading}
        />
      </div>
    </div>
  );
}; 
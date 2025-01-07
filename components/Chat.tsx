'use client';

import { useMessages } from '@/hooks/use-messages';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ReloadIcon } from '@radix-ui/react-icons';

interface ChatProps {
  channelId: string;
}

export const Chat = ({ channelId }: ChatProps) => {
  const { messages, loading, error, sendMessage, updateMessageReactions, refreshMessages } = useMessages(channelId);

  const handleSendMessage = async (message: { text: string; fileUrl?: string }) => {
    try {
      return await sendMessage(message);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
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
          onReactionsUpdate={(messageId, reactions) => updateMessageReactions({ messageId, reactions })}
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
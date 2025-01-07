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

  if (error) {
    return (
      <div className="flex flex-col h-[calc(100vh-64px)] items-center justify-center p-4">
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <button
          onClick={refreshMessages}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ReloadIcon className="h-4 w-4" />
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <div className="flex-1 overflow-hidden pb-[80px]">
        <MessageList 
          messages={messages} 
          onReactionsUpdate={updateMessageReactions}
        />
      </div>
      <MessageInput
        onSend={sendMessage}
        isLoading={loading}
      />
    </div>
  );
}; 
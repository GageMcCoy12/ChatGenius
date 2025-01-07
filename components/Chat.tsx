'use client';

import { useMessages } from '@/hooks/use-messages';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';

interface ChatProps {
  channelId: string;
}

export const Chat = ({ channelId }: ChatProps) => {
  const { messages, loading, sendMessage } = useMessages(channelId);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <div className="flex-1 overflow-hidden pb-[80px]">
        <MessageList messages={messages} />
      </div>
      <MessageInput
        onSend={sendMessage}
        isLoading={loading}
      />
    </div>
  );
}; 
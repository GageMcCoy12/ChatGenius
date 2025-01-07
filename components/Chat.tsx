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
    <div className="flex flex-col h-full">
      <MessageList messages={messages} />
      <MessageInput
        onSend={sendMessage}
        isLoading={loading}
      />
    </div>
  );
}; 
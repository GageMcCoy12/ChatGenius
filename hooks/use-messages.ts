import { useState, useEffect } from 'react';
import axios from 'axios';

interface Message {
  id: string;
  text: string;
  userId: string;
  channelId: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    imageURL?: string;
  };
}

export const useMessages = (channelId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch messages
  const fetchMessages = async () => {
    try {
      const response = await axios.get<Message[]>(`/api/messages?channelId=${channelId}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  // Send a message
  const sendMessage = async (text: string) => {
    try {
      const response = await axios.post<Message>('/api/messages', {
        text,
        channelId,
      });
      setMessages((prev) => [...prev, response.data]);
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  // Load messages when channel changes
  useEffect(() => {
    if (channelId) {
      setLoading(true);
      fetchMessages();
    }
  }, [channelId]);

  return {
    messages,
    loading,
    sendMessage,
    refreshMessages: fetchMessages,
  };
}; 
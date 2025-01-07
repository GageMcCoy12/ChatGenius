import { useState, useEffect } from 'react';
import axios from 'axios';
import { Message } from '@/types/messages';

export const useMessages = (channelId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch messages
  const fetchMessages = async () => {
    try {
      setError(null);
      const response = await axios.get<Message[]>(`/api/messages?channelId=${channelId}`);
      
      // Validate response data
      if (!Array.isArray(response.data)) {
        throw new Error('Invalid response format');
      }
      
      // Validate each message has required fields
      const validMessages = response.data.every(msg => 
        msg.id && msg.text && msg.userId && msg.user && 
        typeof msg.user.username === 'string' &&
        Array.isArray(msg.reactions)
      );
      
      if (!validMessages) {
        throw new Error('Invalid message format');
      }

      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch messages');
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  // Send a message
  const sendMessage = async (text: string) => {
    try {
      setError(null);
      const response = await axios.post<Message>('/api/messages', {
        text,
        channelId,
      });
      
      // Validate response data
      if (!response.data.id || !response.data.text) {
        throw new Error('Invalid message format');
      }

      setMessages((prev) => [...prev, response.data]);
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  // Update reactions for a message
  const updateMessageReactions = async (messageId: string, updatedReactions: Message['reactions']) => {
    try {
      setError(null);
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, reactions: updatedReactions }
            : msg
        )
      );
    } catch (error) {
      console.error('Error updating reactions:', error);
      setError(error instanceof Error ? error.message : 'Failed to update reactions');
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
    error,
    sendMessage,
    refreshMessages: fetchMessages,
    updateMessageReactions,
  };
}; 
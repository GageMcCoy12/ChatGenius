import { useQueryClient, useQuery } from "@tanstack/react-query";
import { Message } from "@/types/messages";
import { useAuth } from "@clerk/nextjs";

export function useMessages(channelId: string) {
  const queryClient = useQueryClient();
  const queryKey = ['messages', channelId];
  const { userId } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const response = await fetch(`/api/channels/messages?channelId=${channelId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      const messages = await response.json();
      return messages as Message[];
    },
    enabled: !!channelId
  });

  const addMessage = (newMessage: Message) => {
    // If the message is from the current user, it's an optimistic update
    const isOptimistic = newMessage.userId === "current";
    
    queryClient.setQueryData(queryKey, (oldData: Message[] | undefined) => {
      const messages = [...(oldData || [])];
      
      // For optimistic updates, add the message
      if (isOptimistic) {
        newMessage.userId = userId as string; // Replace temporary ID with real one
        messages.push(newMessage);
      } else {
        // For messages from other users, only add if not already present
        const exists = messages.some(msg => msg.id === newMessage.id);
        if (!exists) {
          messages.push(newMessage);
        }
      }
      
      return messages;
    });
  };

  return { 
    messages: data || [], 
    isLoading,
    addMessage
  };
} 
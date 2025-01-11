export interface User {
  id: string;
  username: string;
  imageUrl?: string;
  isOnline: boolean;
}

export interface Reaction {
  id: string;
  emoji: string;
  userId: string;
  messageId: string;
  user: User;
}

export interface Message {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  channelId: string;
  replyToId?: string | null;
  threadCount: number;
  user: User;
  reactions: Reaction[];
  replyTo?: Message | null;
  replies?: Message[];
} 
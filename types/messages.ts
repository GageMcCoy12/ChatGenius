export interface User {
  id: string;
  username: string;
  imageURL?: string;
}

export interface Reaction {
  id: string;
  emoji: string;
  userId: string;
  user: User;
}

export interface Attachment {
  id: string;
  fileUrl: string;
  fileType: string;
  fileName: string;
  fileSize: number;
}

export interface Message {
  id: string;
  content: string;
  fileUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  channelId: string;
  replyToId?: string;
  replyCount?: number;
  lastReplyAt?: Date;
  reactions?: MessageReaction[];
  replies?: Message[];
  user: {
    id: string;
    username: string;
    imageUrl: string | null;
    isOnline: boolean;
  };
}

export interface MessageReaction {
  id: string;
  emoji: string;
  messageId: string;
  userId: string;
  user: {
    id: string;
    username: string;
    imageUrl: string | null;
  };
}

export interface MessageAttachment {
  id: string;
  messageId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
} 
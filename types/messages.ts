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
  text: string;
  fileUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  channelId: string;
  user: {
    id: string;
    username: string;
    imageURL?: string;
  };
  reactions: MessageReaction[];
  attachments: MessageAttachment[];
  
  // Thread functionality
  isThread: boolean;
  replyCount: number;
  lastReplyAt?: Date;
  
  // Reply relationships
  replyToId?: string;
  replyTo?: Message;
  replies?: Message[];
}

export interface MessageReaction {
  id: string;
  emoji: string;
  userId: string;
  messageId: string;
  user: {
    id: string;
    username: string;
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
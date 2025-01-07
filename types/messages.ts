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
  createdAt: string;
  updatedAt: string;
  userId: string;
  channelId: string;
  user: User;
  reactions: Reaction[];
  attachments: Attachment[];
} 
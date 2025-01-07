interface Reaction {
  emoji: string;
  _count: number;
}

export interface Message {
  id: string;
  text: string;
  userId: string;
  channelId: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    imageURL: string | null;
  };
  reactions: Reaction[];
} 
export interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface StyleAnalysis {
  messageCount: number;
  averageLength: number;
  commonPhrases: string[];
  tone: string;
  writingStyle: string;
}

export interface MessageRetrievalResult {
  styleMessages: Message[];
  contextMessages: Message[];
  styleAnalysis: StyleAnalysis;
}

export interface PromptConstructionParams {
  styleAnalysis: StyleAnalysis;
  contextMessages: Message[];
  question: string;
  userToMimic: string;
} 
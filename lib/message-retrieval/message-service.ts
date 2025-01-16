import { Message, MessageRetrievalResult, StyleAnalysis } from './types';
import { OpenAI } from 'openai';
import { getIndex, INDEXES } from '../pinecone-client';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY environment variable is not set');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function getEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-large",
    input: text,
    encoding_format: "float"
  });

  return response.data[0].embedding;
}

export async function retrieveMessages(
  question: string,
  requestingUserId: string,
  otherUserId: string
): Promise<MessageRetrievalResult> {
  const index = getIndex('MESSAGES');

  // Get style messages (from other user only)
  const styleQuery = await index.query({
    vector: await getEmbedding(question),
    filter: { senderId: otherUserId },
    topK: 10,
    includeMetadata: true
  });

  // Get context messages (from both users)
  const contextQuery = await index.query({
    vector: await getEmbedding(question),
    filter: {
      senderId: { $in: [requestingUserId, otherUserId] }
    },
    topK: 20,
    includeMetadata: true
  });

  const styleMessages = styleQuery.matches.map(match => ({
    id: match.id,
    content: match.metadata?.content as string,
    senderId: match.metadata?.senderId as string,
    timestamp: new Date(match.metadata?.timestamp as string),
    metadata: match.metadata
  }));

  const contextMessages = contextQuery.matches.map(match => ({
    id: match.id,
    content: match.metadata?.content as string,
    senderId: match.metadata?.senderId as string,
    timestamp: new Date(match.metadata?.timestamp as string),
    metadata: match.metadata
  }));

  const styleAnalysis = analyzeStyle(styleMessages);

  return {
    styleMessages,
    contextMessages,
    styleAnalysis
  };
}

function analyzeStyle(messages: Message[]): StyleAnalysis {
  const totalLength = messages.reduce((acc, msg) => acc + msg.content.length, 0);
  const averageLength = totalLength / messages.length;

  // This is a simple implementation - you might want to use more sophisticated NLP
  return {
    messageCount: messages.length,
    averageLength,
    commonPhrases: extractCommonPhrases(messages),
    tone: analyzeTone(messages),
    writingStyle: analyzeWritingStyle(messages)
  };
}

function extractCommonPhrases(messages: Message[]): string[] {
  // Placeholder - implement phrase extraction logic
  return [];
}

function analyzeTone(messages: Message[]): string {
  // Placeholder - implement tone analysis logic
  return 'neutral';
}

function analyzeWritingStyle(messages: Message[]): string {
  // Placeholder - implement writing style analysis logic
  return 'casual';
} 
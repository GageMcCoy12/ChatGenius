import { Pinecone } from '@pinecone-database/pinecone';

if (!process.env.PINECONE_API_KEY) {
  throw new Error('PINECONE_API_KEY environment variable is not set');
}

if (!process.env.PINECONE_INDEX) {
  throw new Error('PINECONE_INDEX environment variable is not set');
}

// Create a single Pinecone client instance
export const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY
});

// Single index for all features
export const INDEXES = {
  MESSAGES: process.env.PINECONE_INDEX
} as const;

// Helper function to get an index with type checking
export function getIndex(name: keyof typeof INDEXES) {
  const indexName = INDEXES[name];
  if (!indexName) {
    throw new Error(`Index ${name} not found`);
  }
  return pinecone.index(indexName);
} 
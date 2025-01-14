import { OpenAIEmbeddings } from "@langchain/openai";
import { prisma } from "./prisma";
import { pineconeIndex } from "./pinecone-client";

const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "text-embedding-3-small"
});

// Helper function to concatenate embeddings to get 3072 dimensions
async function get3072Embedding(text: string): Promise<number[]> {
  // Get two separate embeddings and concatenate them
  const [embedding1, embedding2] = await Promise.all([
    embeddings.embedQuery(text),
    embeddings.embedQuery(text + " [duplicate for dimension matching]")
  ]);
  return [...embedding1, ...embedding2];
}

async function get3072Embeddings(texts: string[]): Promise<number[][]> {
  return Promise.all(texts.map(text => get3072Embedding(text)));
}

export async function syncMessagesToVectorDB() {
  // Fetch all messages from Postgres
  const messages = await prisma.message.findMany({
    include: {
      user: true,
      channel: true,
    },
  });

  console.log(`Processing ${messages.length} messages for embedding...`);

  // Process messages in batches to avoid rate limits
  const batchSize = 100;
  for (let i = 0; i < messages.length; i += batchSize) {
    const batch = messages.slice(i, i + batchSize);
    
    // Just use the message content for embeddings
    const texts = batch.map(message => message.content);

    // Create embeddings
    const vectorEmbeddings = await get3072Embeddings(texts);

    // Prepare vectors for Pinecone
    const vectors = batch.map((message, idx) => ({
      id: message.id,
      values: vectorEmbeddings[idx],
      metadata: {
        content: message.content,
        channelName: message.channel.name,
        senderName: message.user.username,
        createdAt: message.createdAt.toISOString()
      },
    }));

    // Upsert vectors to Pinecone
    await pineconeIndex.upsert(vectors);

    console.log(`Processed batch ${i / batchSize + 1}`);
  }

  console.log('Finished syncing messages to vector database');
} 
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
  console.log("Starting message sync to vector database...");

  try {
    // Get all messages from non-DM channels
    const messages = await prisma.message.findMany({
      where: {
        NOT: {
          channel: {
            id: {
              startsWith: 'dm-'
            }
          }
        }
      },
      include: {
        channel: true,
        user: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Process messages in batches of 100 to avoid rate limits
    const batchSize = 100;
    for (let i = 0; i < messages.length; i += batchSize) {
      const batch = messages.slice(i, i + batchSize);
      
      // Prepare texts for embedding
      const texts = batch.map(message => message.content);
      
      // Create embeddings
      const embeddings = await get3072Embeddings(texts);
      
      // Prepare vectors for Pinecone
      const vectors = embeddings.map((embedding, idx) => ({
        id: batch[idx].id,
        values: embedding,
        metadata: {
          content: batch[idx].content,
          channelId: batch[idx].channelId,
          channelName: batch[idx].channel.name,
          senderId: batch[idx].userId,
          senderName: batch[idx].user.username,
          createdAt: batch[idx].createdAt.toISOString()
        }
      }));

      // Upsert vectors to Pinecone
      await pineconeIndex.upsert(vectors);
      
      console.log(`Processed ${i + batch.length} of ${messages.length} messages`);
    }

    console.log("Successfully synced messages to vector database");
  } catch (error) {
    console.error("Error syncing messages:", error);
    throw error;
  }
} 
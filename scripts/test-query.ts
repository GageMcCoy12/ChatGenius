import "dotenv/config";
import { OpenAIEmbeddings } from "@langchain/openai";
import { pineconeIndex } from "../lib/pinecone-client";

const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "text-embedding-3-small"
});

// Helper function to get 3072-dimensional embedding
async function get3072Embedding(text: string): Promise<number[]> {
  // Get two separate embeddings and concatenate them
  const [embedding1, embedding2] = await Promise.all([
    embeddings.embedQuery(text),
    embeddings.embedQuery(text + " [duplicate for dimension matching]")
  ]);
  return [...embedding1, ...embedding2];
}

async function queryMessages(query: string) {
  console.log(`Searching for: "${query}"`);
  
  // Generate embeddings for the query
  const queryEmbedding = await get3072Embedding(query);
  
  // Query Pinecone
  const results = await pineconeIndex.query({
    vector: queryEmbedding,
    topK: 10,
    includeMetadata: true
  });

  console.log("\nAll messages in the database:");
  results.matches?.forEach((match, i) => {
    console.log(`\n${i + 1}. Similarity: ${match.score?.toFixed(3)}`);
    console.log(`Channel: ${match.metadata?.channelName}`);
    console.log(`From: ${match.metadata?.senderName}`);
    console.log(`Message: ${match.metadata?.content}`);
    const createdAt = match.metadata?.createdAt;
    console.log(`Time: ${createdAt ? new Date(createdAt as string).toLocaleString() : 'Unknown'}`);
  });
}

// Get query from command line argument
const query = process.argv[2];
if (!query) {
  console.error("Please provide a search query as an argument");
  process.exit(1);
}

queryMessages(query); 
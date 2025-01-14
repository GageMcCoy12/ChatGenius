import { ChatOpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { PromptTemplate } from "@langchain/core/prompts";
import { OpenAIEmbeddings } from "@langchain/openai";
import { pineconeIndex } from "./pinecone-client";

const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "text-embedding-3-small"
});

async function get3072Embedding(text: string): Promise<number[]> {
  // Get two embeddings and concatenate them
  const [embedding1, embedding2] = await Promise.all([
    embeddings.embedQuery(text),
    embeddings.embedQuery(text + " "), // Add space to get slightly different embedding
  ]);
  return [...embedding1, ...embedding2];
}

const model = new ChatOpenAI({
  modelName: "gpt-4-turbo-preview",
  temperature: 0.7,
});

const TEMPLATE = `You are a helpful AI assistant that answers questions based on the provided context from a chat application.
Use the following pieces of relevant chat messages to answer the question. 
If you don't know the answer, just say that you don't know. Don't try to make up an answer.

Context:
{context}

Question: {question}

Answer in a conversational tone. If the context includes timestamps, you can mention how recent or old the messages are.`;

const prompt = PromptTemplate.fromTemplate(TEMPLATE);

async function getRelevantContext(query: string, topK: number = 3): Promise<string> {
  console.log("[RAG] Getting context for query:", query);
  console.log("[RAG] Generating embedding...");
  const queryEmbedding = await get3072Embedding(query);
  console.log("[RAG] Generated embedding of length:", queryEmbedding.length);

  console.log("[RAG] Querying Pinecone...");
  const results = await pineconeIndex.query({
    vector: queryEmbedding,
    topK,
    includeMetadata: true,
    filter: {
      // Only return results that have channelName in metadata
      channelName: { $exists: true }
    }
  });
  console.log("[RAG] Pinecone results:", JSON.stringify(results.matches, null, 2));

  const context = results.matches
    ?.filter(match => match.metadata && match.metadata.content)
    .map((match) => {
      const metadata = match.metadata;
      const timestamp = typeof metadata?.createdAt === 'string' ? new Date(metadata.createdAt).toLocaleString() : 'Unknown time';
      return `[Channel: ${metadata?.channelName || 'Unknown'}] [From: ${metadata?.senderName || 'Unknown'}] [Time: ${timestamp}]\n${metadata?.content}\n`;
    })
    .join("\n") || "";
  
  console.log("[RAG] Final context:", context);
  return context;
}

export const ragChain = RunnableSequence.from([
  {
    context: async (input: { question: string }) => 
      getRelevantContext(input.question),
    question: (input: { question: string }) => input.question,
  },
  prompt,
  model,
  new StringOutputParser(),
]); 
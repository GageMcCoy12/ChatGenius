import { OpenAI } from 'openai';
import { prisma } from '../lib/db';
import { getIndex, INDEXES } from '../lib/pinecone-client';

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

async function populateEmbeddings() {
  console.log('🚀 Starting embedding population...');

  // Get all messages that need embeddings
  const messages = await prisma.message.findMany({
    include: {
      user: true,
      channel: true
    }
  });

  console.log(`📝 Found ${messages.length} messages to process`);

  const index = getIndex('MESSAGES');

  // Process messages in batches to avoid rate limits
  const batchSize = 10;
  for (let i = 0; i < messages.length; i += batchSize) {
    const batch = messages.slice(i, i + batchSize);
    console.log(`\n🔄 Processing batch ${i / batchSize + 1} of ${Math.ceil(messages.length / batchSize)}`);

    const vectors = await Promise.all(
      batch.map(async (message) => {
        const embedding = await getEmbedding(message.content);
        return {
          id: message.id,
          values: embedding,
          metadata: {
            content: message.content,
            senderId: message.userId,
            channelId: message.channelId,
            timestamp: message.createdAt.toISOString(),
            username: message.user.username
          }
        };
      })
    );

    // Upsert vectors to Pinecone
    await index.upsert(vectors);
    console.log(`✅ Processed and uploaded ${vectors.length} messages`);

    // Sleep between batches to avoid rate limits
    if (i + batchSize < messages.length) {
      console.log('😴 Sleeping for 2 seconds to avoid rate limits...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.log('\n🎉 Finished populating embeddings!');
}

// Run the script
populateEmbeddings()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  }); 
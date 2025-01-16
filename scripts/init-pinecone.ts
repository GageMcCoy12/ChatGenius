import { pinecone, INDEXES } from '../lib/pinecone-client';

async function initializePinecone() {
  console.log('🚀 Initializing Pinecone...');

  try {
    // Try to describe the index - if it doesn't exist, this will throw
    const indexDescription = await pinecone.describeIndex(INDEXES.MESSAGES);
    console.log(`✅ Index '${INDEXES.MESSAGES}' already exists`);
    return;
  } catch (error) {
    // If the index doesn't exist, create it
    console.log(`📝 Creating index '${INDEXES.MESSAGES}'...`);
    
    await pinecone.createIndex({
      name: INDEXES.MESSAGES,
      dimension: 3072,
      metric: 'cosine',
      spec: {
        serverless: {
          cloud: 'aws',
          region: 'us-west-2'
        }
      }
    });

    console.log(`🎉 Created index '${INDEXES.MESSAGES}'`);

    // Wait for the index to be ready
    let isReady = false;
    while (!isReady) {
      console.log('⏳ Waiting for index to be ready...');
      try {
        const description = await pinecone.describeIndex(INDEXES.MESSAGES);
        if (description.status?.ready) {
          isReady = true;
          console.log('✅ Index is ready!');
        } else {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error('❌ Error checking index status:', error);
        throw error;
      }
    }
  }
}

// Run the initialization
initializePinecone()
  .catch(console.error); 
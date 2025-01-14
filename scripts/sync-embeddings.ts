import { syncMessagesToVectorDB } from "../lib/message-embeddings";

async function main() {
  console.log("Starting message sync to vector database...");
  
  try {
    await syncMessagesToVectorDB();
    console.log("Successfully synced messages to vector database");
  } catch (error) {
    console.error("Error syncing messages:", error);
    process.exit(1);
  }
}

main(); 
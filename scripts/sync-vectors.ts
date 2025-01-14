import { syncMessagesToVectorDB } from "../lib/message-embeddings";

async function main() {
  console.log("Starting vector database sync...");
  await syncMessagesToVectorDB();
  console.log("Vector database sync completed!");
  process.exit(0);
}

main().catch((error) => {
  console.error("Error syncing vectors:", error);
  process.exit(1);
}); 
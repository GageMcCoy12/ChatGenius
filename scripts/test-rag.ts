import "dotenv/config";
import { ragChain } from "../lib/rag-chain";

async function testQuery(question: string) {
  console.log("\n=== Starting RAG Chain Test ===");
  console.log("Question:", question);
  
  try {
    const response = await ragChain.invoke(
      { question },
      {
        callbacks: [{
          handleChainStart: () => {
            console.log("\n🔄 Chain started");
          },
          handleChainEnd: (outputs: any) => {
            console.log("\n✅ Chain completed");
            console.log("Outputs:", JSON.stringify(outputs, null, 2));
          },
          handleLLMStart: () => {
            console.log("\n🤖 LLM started");
          },
          handleLLMEnd: () => {
            console.log("🤖 LLM completed");
          },
        }],
      }
    );
    
    console.log("\n=== Final Response ===");
    console.log(response);
  } catch (error) {
    console.error("\n❌ Error:", error);
  }
}

// Get question from command line argument
const question = process.argv[2];
if (!question) {
  console.error("Please provide a question as an argument");
  process.exit(1);
}

testQuery(question); 
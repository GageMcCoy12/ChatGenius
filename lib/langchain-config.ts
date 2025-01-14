import { OpenAI } from "@langchain/openai";
import { ChatOpenAI } from "@langchain/openai";

// Initialize the OpenAI model
export const llm = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0.7,
});

// Initialize the Chat model
export const chatModel = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0.7,
}); 
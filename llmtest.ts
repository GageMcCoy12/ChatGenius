import { ChatOpenAI } from "@langchain/openai";

const llm = new ChatOpenAI();
llm.invoke("Hello, world!");
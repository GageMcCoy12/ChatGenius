import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { prisma } from "@/lib/db";
import { retrieveMessages } from "@/lib/message-retrieval/message-service";
import { constructPrompt } from "@/lib/message-retrieval/prompt-utils";
import { ChatOpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { PromptTemplate } from "@langchain/core/prompts";

// Initialize LangChain chat model
const model = new ChatOpenAI({
  modelName: "gpt-4-turbo-preview",
  temperature: 0.7,
});

// Create prompt template
const TEMPLATE = `You are roleplaying as {username}. You must ONLY respond with information and in a style that matches the provided message history from this user.

Style Analysis:
{styleAnalysis}

Relevant Message History:
{messageHistory}

Current Question: {question}

Rules:
1. ONLY use information from the provided message history
2. Maintain the user's writing style and tone
3. If you can't find relevant information in the message history, politely decline to answer
4. Keep responses concise and natural

Response:`;

const prompt = PromptTemplate.fromTemplate(TEMPLATE);

// Create the chain
const chain = RunnableSequence.from([
  {
    username: (input: any) => input.username,
    styleAnalysis: (input: any) => JSON.stringify(input.styleAnalysis, null, 2),
    messageHistory: (input: any) => input.messageHistory,
    question: (input: any) => input.question,
  },
  prompt,
  model,
  new StringOutputParser(),
]);

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { content, question, channelId } = body;
    
    // Use either content or question
    const queryText = content || question;
    if (!queryText) {
      return new NextResponse("No query text provided", { status: 400 });
    }

    // For search queries (non-DM), skip channel verification
    if (!channelId.startsWith('dm-')) {
      // Get all messages from the channel for context
      const channelMessages = await prisma.message.findMany({
        where: { channelId },
        orderBy: { createdAt: 'desc' },
        take: 50,
        include: { user: true }
      });

      // Format message history
      const messageHistory = channelMessages
        .reverse()
        .map(msg => `[${new Date(msg.createdAt).toLocaleString()}] ${msg.user.username}: ${msg.content}`)
        .join("\n");

      // Generate response using LangChain
      const response = await chain.invoke({
        username: "gAIge",
        styleAnalysis: { tone: "helpful and informative", style: "clear and concise" },
        messageHistory,
        question: queryText
      });

      return NextResponse.json(response);
    }

    // DM channel logic
    const channel = await prisma.channel.findUnique({
      where: { id: channelId },
      include: {
        members: true
      }
    });

    if (!channel) {
      return new NextResponse("Channel not found", { status: 404 });
    }

    // Get the other user's ID (the one we're mimicking)
    const otherUserId = channel.members.find(member => member.userId !== profile.id)?.userId;
    if (!otherUserId) {
      return new NextResponse("Other user not found", { status: 404 });
    }

    // Get the other user's details
    const otherUser = await prisma.user.findUnique({
      where: { id: otherUserId }
    });

    if (!otherUser) {
      return new NextResponse("Other user not found", { status: 404 });
    }

    // Retrieve message history and analyze style
    const messageResult = await retrieveMessages(queryText, profile.id, otherUserId);

    // Format message history
    const messageHistory = messageResult.styleMessages
      .map(msg => `[${new Date(msg.timestamp).toLocaleString()}] ${msg.content}`)
      .join("\n");

    // Generate response using LangChain
    const response = await chain.invoke({
      username: otherUser.username || "User",
      styleAnalysis: messageResult.styleAnalysis,
      messageHistory,
      question: queryText
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("[MESSAGES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 
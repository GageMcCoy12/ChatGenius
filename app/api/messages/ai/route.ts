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

    const { content, channelId } = await req.json();

    // Verify this is a DM channel
    if (!channelId.startsWith('dm-')) {
      return new NextResponse("Invalid channel type", { status: 400 });
    }

    // Get channel details
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
    const messageResult = await retrieveMessages(content, profile.id, otherUserId);

    // Format message history
    const messageHistory = messageResult.styleMessages
      .map(msg => `[${new Date(msg.timestamp).toLocaleString()}] ${msg.content}`)
      .join("\n");

    // Generate response using LangChain
    const response = await chain.invoke({
      username: otherUser.username,
      styleAnalysis: messageResult.styleAnalysis,
      messageHistory,
      question: content,
    });

    // Create the AI message in the database
    const message = await prisma.message.create({
      data: {
        content: response,
        channelId,
        userId: otherUserId,
        isAI: true
      },
      include: {
        user: true,
        reactions: true
      }
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("[AI_MESSAGE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 
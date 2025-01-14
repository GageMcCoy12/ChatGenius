import { NextResponse } from "next/server";
import { chatModel } from "@/lib/langchain-config";

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();
    
    const response = await chatModel.invoke(messages);

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Error in chat route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 
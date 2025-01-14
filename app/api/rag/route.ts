import { NextResponse } from "next/server";
import { ragChain } from "@/lib/rag-chain";

export async function POST(request: Request) {
  try {
    const { question } = await request.json();
    
    if (!question) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    const response = await ragChain.invoke({ question });
    return NextResponse.json({ response });
  } catch (error) {
    console.error("Error in RAG route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 
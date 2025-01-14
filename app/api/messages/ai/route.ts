import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { ragChain } from "@/lib/rag-chain";

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { question } = await req.json();
    if (!question) {
      return new NextResponse("Missing question", { status: 400 });
    }

    console.log("[AI_ROUTE] Processing question:", question);
    
    // Get AI response using RAG chain
    const aiResponse = await ragChain.invoke({ question });
    console.log("[AI_ROUTE] Generated response:", aiResponse);

    return NextResponse.json(aiResponse);
  } catch (error) {
    console.error("[AI_ROUTE_ERROR] Full error:", error);
    if (error instanceof Error) {
      console.error("[AI_ROUTE_ERROR] Error message:", error.message);
      console.error("[AI_ROUTE_ERROR] Stack trace:", error.stack);
    }
    return new NextResponse("Internal Error", { status: 500 });
  }
} 
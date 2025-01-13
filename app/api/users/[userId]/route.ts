import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Props = {
  params: { userId: string }
}

type UserStatus = "DEFAULT" | "DND";

export async function GET(
  request: Request,
  { params }: Props
) {
  try {
    // Await the params to get the userId
    const { userId } = params;
    console.log("[USER_GET] Starting request for userId:", userId);
    
    const { userId: currentUserId } = await auth();
    if (!currentUserId) {
      console.log("[USER_GET] Unauthorized - no currentUserId");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { 
        id: userId 
      },
      select: {
        id: true,
        username: true,
        imageUrl: true,
        isOnline: true,
        status: true,
        lastSeen: true
      }
    });

    if (!user) {
      console.log("[USER_GET] User not found:", userId);
      return new NextResponse("User not found", { status: 404 });
    }

    console.log("[USER_GET] Found user:", JSON.stringify(user));
    return NextResponse.json(user);
  } catch (error) {
    // Safely log the error
    console.error("[USER_GET] Error occurred:", {
      message: error instanceof Error ? error.message : "Unknown error",
      name: error instanceof Error ? error.name : "Unknown",
      stack: error instanceof Error ? error.stack : undefined
    });

    return new NextResponse(
      error instanceof Error ? error.message : "Internal Error",
      { status: 500 }
    );
  }
} 
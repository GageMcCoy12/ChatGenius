import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Define valid status types
type UserStatus = "DEFAULT" | "DND";

export async function PUT(req: Request) {
  try {
    console.log("[USER_STATUS] Starting status update request");
    
    const { userId } = await auth();
    if (!userId) {
      console.log("[USER_STATUS] No userId found");
      return new NextResponse("Unauthorized", { status: 401 });
    }
    console.log("[USER_STATUS] Auth result:", { userId });

    const body = await req.json();
    console.log("[USER_STATUS] Request body:", JSON.stringify(body));
    
    if (!body?.status || typeof body.status !== 'string') {
      console.log("[USER_STATUS] Invalid status in request");
      return new NextResponse("Invalid status in request", { status: 400 });
    }

    const status = body.status as UserStatus;
    if (!["DEFAULT", "DND"].includes(status)) {
      console.log("[USER_STATUS] Invalid status value:", status);
      return new NextResponse("Invalid status", { status: 400 });
    }

    // First check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        status: true
      }
    });

    if (!existingUser) {
      console.log("[USER_STATUS] User not found:", userId);
      return new NextResponse("User not found", { status: 404 });
    }

    // Update user status
    const user = await prisma.user.update({
      where: { 
        id: userId 
      },
      data: {
        status: status,
        lastSeen: new Date()
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

    console.log("[USER_STATUS] Update successful:", JSON.stringify(user));

    return NextResponse.json(user);
  } catch (error) {
    // Safely log the error
    console.error("[USER_STATUS] Error occurred:", {
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
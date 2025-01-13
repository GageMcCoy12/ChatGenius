import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    // Await the params to get the userId
    const userId = params.userId;
    console.log("[USER_GET] Starting request for userId:", userId);
    
    const { userId: currentUserId } = await auth();
    if (!currentUserId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    console.log("[USER_GET] Found user:", JSON.stringify(user));
    return NextResponse.json(user);
  } catch (error) {
    console.error("[USER_GET] Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 
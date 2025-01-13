import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { messageId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.messageId) {
      return new NextResponse("Message ID missing", { status: 400 });
    }

    const messages = await prisma.message.findMany({
      where: {
        replyToId: params.messageId,
      },
      include: {
        user: true,
        reactions: {
          include: {
            user: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("[THREAD_MESSAGES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 
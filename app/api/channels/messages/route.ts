import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { broadcastMessage } from '@/lib/pusher'

export async function POST(req: Request) {
  try {
    const session = await auth()
    const userId = session.userId
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { content, channelId, replyToId, fileUrl, fileName, fileType } = await req.json()
    if (!channelId) {
      return new NextResponse("Channel ID missing", { status: 400 })
    }

    if (!content && !fileUrl) {
      return new NextResponse("Content or file required", { status: 400 })
    }

    // Create message with file information if present
    const message = await prisma.message.create({
      data: {
        content: content || "Shared a file",
        channelId,
        userId,
        replyToId,
        ...(fileUrl && {
          fileUrl,
          fileName: fileName || "Uploaded file",
          fileType: fileType || "unknown"
        })
      },
      include: {
        user: true,
        reactions: true,
      }
    })

    if (replyToId) {
      await prisma.message.update({
        where: { id: replyToId },
        data: { threadCount: { increment: 1 } }
      })
    }

    // Log the message details for debugging
    console.log('📢 Broadcasting message:', {
      id: message.id,
      content: message.content,
      fileUrl: message.fileUrl,
      fileName: message.fileName,
      fileType: message.fileType,
      userId: message.userId,
      channelId: message.channelId
    });

    await broadcastMessage(channelId, message);
    console.log('✅ Message broadcasted successfully');

    return NextResponse.json(message)
  } catch (error) {
    console.error("[MESSAGES_POST] Error:", {
      message: error instanceof Error ? error.message : "Unknown error",
      name: error instanceof Error ? error.name : "Unknown",
      stack: error instanceof Error ? error.stack : undefined
    });
    return new NextResponse(
      JSON.stringify({ 
        message: error instanceof Error ? error.message : "Internal server error" 
      }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth()
    const { searchParams } = new URL(req.url)
    const channelId = searchParams.get('channelId')
    const cursor = searchParams.get('cursor')
    const limit = 25

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (!channelId) {
      return new NextResponse("Missing channelId", { status: 400 })
    }

    let messages
    if (cursor) {
      messages = await prisma.message.findMany({
        take: limit,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          channelId,
          replyToId: null
        },
        include: {
          user: true,
          reactions: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    } else {
      messages = await prisma.message.findMany({
        take: limit,
        where: {
          channelId,
          replyToId: null
        },
        include: {
          user: true,
          reactions: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    }

    let nextCursor = null
    if (messages.length === limit) {
      nextCursor = messages[messages.length - 1].id
    }

    return NextResponse.json({
      messages,
      nextCursor,
    })
  } catch (error) {
    console.error("[MESSAGES_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 
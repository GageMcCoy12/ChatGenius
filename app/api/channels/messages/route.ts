import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const session = await auth()
    const userId = session.userId
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { content, channelId, fileUrl, fileName, fileType } = await req.json()
    if (!channelId) {
      return new NextResponse("Channel ID missing", { status: 400 })
    }

    if (!content && !fileUrl) {
      return new NextResponse("Content or file required", { status: 400 })
    }

    const message = await prisma.message.create({
      data: {
        content: content || "Message content unavailable",
        channelId,
        userId,
        ...(fileUrl && {
          fileUrl,
          fileName: fileName || "Uploaded file",
          fileType: fileType || "unknown"
        })
      },
      include: {
        user: true,
      }
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error("[MESSAGES_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
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
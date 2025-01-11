import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'

export async function GET(
  req: Request
) {
  try {
    const { searchParams } = new URL(req.url)
    const channelId = searchParams.get('channelId')

    if (!channelId) {
      return new NextResponse("Channel ID is required", { status: 400 })
    }

    const { userId } = await auth()
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const messages = await db.message.findMany({
      where: {
        channelId: channelId
      },
      include: {
        user: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error("[MESSAGES_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 
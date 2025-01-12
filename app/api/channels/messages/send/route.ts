import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'

export async function POST(
  req: Request
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { content, channelId } = body

    if (!content || !channelId) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const message = await prisma.message.create({
      data: {
        content,
        channelId,
        userId,
        threadCount: 0
      },
      include: {
        user: true
      }
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error("[MESSAGE_SEND]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 
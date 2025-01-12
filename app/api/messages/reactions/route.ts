import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { messageId, emoji } = await req.json()

    if (!messageId || !emoji) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    // Check if reaction already exists
    const existingReaction = await prisma.reaction.findFirst({
      where: {
        messageId,
        userId,
        emoji,
      },
    })

    if (existingReaction) {
      return new NextResponse("Reaction already exists", { status: 400 })
    }

    // Create reaction
    const reaction = await prisma.reaction.create({
      data: {
        messageId,
        userId,
        emoji,
      },
      include: {
        user: true,
      },
    })

    return NextResponse.json(reaction)
  } catch (error) {
    console.error("[REACTIONS_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { messageId, emoji } = await req.json()

    if (!messageId || !emoji) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    // Delete reaction
    await prisma.reaction.deleteMany({
      where: {
        messageId,
        userId,
        emoji,
      },
    })

    return new NextResponse(null, { status: 200 })
  } catch (error) {
    console.error("[REACTIONS_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 
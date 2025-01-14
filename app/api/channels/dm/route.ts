import { NextResponse } from "next/server"
import { currentProfile } from "@/lib/current-profile"
import { prisma } from "@/lib/prisma"
import { Channel } from "@prisma/client"

export async function POST(req: Request) {
  try {
    const profile = await currentProfile()
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { otherUserId } = await req.json()
    if (!otherUserId) {
      return new NextResponse("Other user ID is required", { status: 400 })
    }

    // Create a unique, consistent channel ID for the DM
    const userIds = [profile.id, otherUserId].sort()
    const channelId = `dm-${userIds[0]}-${userIds[1]}`

    // Check if DM channel already exists
    let channel = await prisma.channel.findUnique({
      where: { id: channelId }
    })

    // If channel doesn't exist, create it
    if (!channel) {
      channel = await prisma.channel.create({
        data: {
          id: channelId,
          name: channelId, // We'll update this with usernames later
          members: {
            create: [
              { userId: profile.id },
              { userId: otherUserId }
            ]
          }
        }
      })

      // Update channel name with usernames
      const users = await prisma.user.findMany({
        where: {
          id: {
            in: [profile.id, otherUserId]
          }
        }
      })

      const channelName = users
        .map(user => user.username)
        .sort()
        .join(", ")

      channel = await prisma.channel.update({
        where: { id: channelId },
        data: { name: channelName }
      })
    }

    if (!channel) {
      return new NextResponse("Failed to create channel", { status: 500 })
    }

    return NextResponse.json({ channelId: channel.id })
  } catch (error) {
    console.error("[CHANNEL_DM_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 
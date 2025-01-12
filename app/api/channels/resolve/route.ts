import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const channelId = searchParams.get('channelId');

    if (!channelId) {
      return new NextResponse("Channel ID is required", { status: 400 });
    }

    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const channel = await prisma.channel.findUnique({
      where: {
        id: channelId
      },
      select: {
        id: true,
        name: true
      }
    });

    if (!channel) {
      return new NextResponse("Channel not found", { status: 404 });
    }

    return NextResponse.json(channel);
  } catch (error) {
    console.error("[CHANNEL_RESOLVE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 
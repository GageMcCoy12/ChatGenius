import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const channelId = searchParams.get('channelId');

    if (!channelId) {
      return new NextResponse('Channel ID required', { status: 400 });
    }

    // Find channel by name or ID
    let channel;
    if (!channelId.startsWith('dm-')) {
      channel = await prisma.channel.findFirst({
        where: {
          name: channelId,
        },
      });
    } else {
      channel = await prisma.channel.findUnique({
        where: { id: channelId },
      });
    }

    if (!channel) {
      return new NextResponse('Channel not found', { status: 404 });
    }

    return NextResponse.json(channel);
  } catch (error) {
    console.error('RESOLVE CHANNEL ERROR:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 
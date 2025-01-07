import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

// Get messages for a channel
export async function GET(req: Request) {
  try {
    const user = await currentUser();
    const { searchParams } = new URL(req.url);
    const channelId = searchParams.get('channelId');

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!channelId) {
      return new NextResponse('Channel ID is required', { status: 400 });
    }

    const messages = await prisma.message.findMany({
      where: {
        channelId: channelId,
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('GET MESSAGES ERROR:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

// Send a new message
export async function POST(req: Request) {
  try {
    const user = await currentUser();
    const { text, channelId } = await req.json();

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!text || !channelId) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const message = await prisma.message.create({
      data: {
        text,
        userId: user.id,
        channelId,
      },
      include: {
        user: true,
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error('POST MESSAGE ERROR:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 
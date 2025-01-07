import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { Message } from '@/types/messages';

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

    // Ensure channel exists
    const channel = await prisma.channel.upsert({
      where: { id: channelId },
      update: {},
      create: {
        id: channelId,
        name: channelId,
      },
    });

    // Get messages with user data
    const dbMessages = await prisma.message.findMany({
      where: {
        channelId: channel.id,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            imageURL: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Get reactions for each message
    const messagesWithReactions = await Promise.all(
      dbMessages.map(async (message) => {
        const reactions = await prisma.messageReaction.groupBy({
          by: ['emoji'],
          where: { messageId: message.id },
          _count: true,
        });

        // Format to match our Message type
        const formattedMessage: Message = {
          id: message.id,
          text: message.text,
          userId: message.userId,
          channelId: message.channelId,
          createdAt: message.createdAt.toISOString(),
          user: {
            id: message.user.id,
            username: message.user.username,
            imageURL: message.user.imageURL,
          },
          reactions: reactions.map(r => ({
            emoji: r.emoji,
            _count: r._count,
          })),
        };

        return formattedMessage;
      })
    );

    return NextResponse.json(messagesWithReactions);
  } catch (error) {
    console.error('GET MESSAGES ERROR:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch messages' }), 
      { status: 500 }
    );
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

    // Ensure channel exists
    const channel = await prisma.channel.upsert({
      where: { id: channelId },
      update: {},
      create: {
        id: channelId,
        name: channelId,
      },
    });

    // Create message
    const dbMessage = await prisma.message.create({
      data: {
        text,
        userId: user.id,
        channelId: channel.id,
      },
      include: {
        user: true,
      },
    });

    // Format message to match our Message type
    const message: Message = {
      ...dbMessage,
      createdAt: dbMessage.createdAt.toISOString(),
      reactions: [],
    };

    return NextResponse.json(message);
  } catch (error) {
    console.error('POST MESSAGE ERROR:', error);
    return new NextResponse(error instanceof Error ? error.message : 'Internal Error', { status: 500 });
  }
} 
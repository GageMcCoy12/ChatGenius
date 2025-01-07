import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { pusherServer } from '@/lib/pusher';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { text, channelId, fileUrl } = await req.json();
    console.log('Attempting to send message to channel:', { channelId, text });

    if (!text || !channelId) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Check if channel exists by name for non-DM channels
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
      console.error('Channel not found:', { channelId });
      return new NextResponse('Channel not found', { status: 404 });
    }

    console.log('Found channel:', { channelId: channel.id, name: channel.name });

    // Create the message
    const message = await prisma.message.create({
      data: {
        text,
        channelId: channel.id, // Use the actual channel ID
        userId,
        ...(fileUrl && {
          attachments: {
            create: {
              fileUrl,
              fileType: fileUrl.includes('.pdf') ? 'application/pdf' : 'image/jpeg',
              fileName: fileUrl.split('/').pop() || 'file',
            },
          },
        }),
      },
      include: {
        user: true,
        attachments: true,
        reactions: {
          include: {
            user: true
          }
        },
      },
    });

    await pusherServer.trigger(channel.id, 'new-message', message);
    return NextResponse.json(message);
  } catch (error) {
    console.error('POST MESSAGES ERROR:', error);
    return new NextResponse(
      error instanceof Error ? error.message : 'Internal Server Error',
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const channelId = searchParams.get('channelId');
    console.log('Fetching messages for channel:', { channelId });

    if (!channelId) {
      return new NextResponse('Channel ID required', { status: 400 });
    }

    // Check if channel exists by name for non-DM channels
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
      console.error('Channel not found:', { channelId });
      return new NextResponse('Channel not found', { status: 404 });
    }

    console.log('Found channel:', { channelId: channel.id, name: channel.name });

    const messages = await prisma.message.findMany({
      where: {
        channelId: channel.id,
      },
      include: {
        user: true,
        attachments: true,
        reactions: {
          include: {
            user: true
          }
        },
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
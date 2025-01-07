import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { pusherServer } from '@/lib/pusher';

export async function PUT(
  req: Request,
  { params }: { params: { messageId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { reactions } = await req.json();
    const messageId = params.messageId;

    // Get the message to check if it exists and get its channelId
    const message = await prisma.message.findUnique({
      where: { id: messageId },
      include: { reactions: true },
    });

    if (!message) {
      return new NextResponse('Message not found', { status: 404 });
    }

    // Delete existing reactions for this message
    await prisma.messageReaction.deleteMany({
      where: { messageId },
    });

    // Create new reactions
    const updatedMessage = await prisma.message.update({
      where: { id: messageId },
      data: {
        reactions: {
          create: reactions.map((reaction: any) => ({
            emoji: reaction.emoji,
            userId: reaction.userId,
          })),
        },
      },
      include: {
        reactions: {
          include: {
            user: true,
          },
        },
      },
    });

    // Trigger real-time update
    await pusherServer.trigger(message.channelId, 'message-updated', updatedMessage);

    return NextResponse.json(updatedMessage);
  } catch (error) {
    console.error('UPDATE REACTIONS ERROR:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 
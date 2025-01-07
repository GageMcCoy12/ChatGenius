import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

// Add a reaction
export async function POST(
  req: Request,
  { params }: { params: { messageId: string } }
) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { emoji } = await req.json();
    if (!emoji) {
      return new NextResponse('Emoji is required', { status: 400 });
    }

    // Toggle the reaction (add if doesn't exist, remove if it does)
    const existingReaction = await prisma.messageReaction.findUnique({
      where: {
        userId_messageId_emoji: {
          userId: user.id,
          messageId: params.messageId,
          emoji,
        },
      },
    });

    if (existingReaction) {
      // Remove reaction if it exists
      await prisma.messageReaction.delete({
        where: { id: existingReaction.id },
      });
    } else {
      // Add reaction if it doesn't exist
      await prisma.messageReaction.create({
        data: {
          emoji,
          userId: user.id,
          messageId: params.messageId,
        },
      });
    }

    // Get updated reactions for the message
    const reactions = await prisma.messageReaction.groupBy({
      by: ['emoji'],
      where: { messageId: params.messageId },
      _count: true,
    });

    return NextResponse.json(reactions);
  } catch (error) {
    console.error('REACTION ERROR:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

// Get reactions for a message
export async function GET(
  req: Request,
  { params }: { params: { messageId: string } }
) {
  try {
    const reactions = await prisma.messageReaction.groupBy({
      by: ['emoji'],
      where: { messageId: params.messageId },
      _count: true,
    });

    return NextResponse.json(reactions);
  } catch (error) {
    console.error('GET REACTIONS ERROR:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 
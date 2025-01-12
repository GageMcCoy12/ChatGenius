import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

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
    const { messageId } = params;

    const message = await prisma.message.update({
      where: { id: messageId },
      data: {
        reactions: {
          deleteMany: {},
          create: reactions.map((reaction: { emoji: string; userId: string }) => ({
            emoji: reaction.emoji,
            userId: reaction.userId,
          })),
        },
      },
      include: {
        reactions: true,
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error('[MESSAGE_REACTIONS]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 
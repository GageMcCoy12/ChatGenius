import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const MessageSchema = z.object({
  query: z.string().min(1),
  channelId: z.string().optional(),
});

export async function GET(request: Request) {
  try {
    const session = await auth();
    const userId = session?.userId;
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const channelId = searchParams.get('channelId');

    if (!query) {
      return NextResponse.json({ resultCount: 0, results: [] });
    }

    const validatedParams = MessageSchema.parse({ query, channelId });

    const messages = await prisma.message.findMany({
      where: {
        content: {
          contains: validatedParams.query,
          mode: 'insensitive',
        },
        ...(validatedParams.channelId ? {
          channelId: validatedParams.channelId
        } : {}),
      },
      include: {
        channel: true,
        user: {
          select: {
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });

    return NextResponse.json({
      resultCount: messages.length,
      results: messages.map((m: any) => ({
        content: m.content,
        channel: m.channel.name,
        username: m.user.username,
      })),
    });
  } catch (error) {
    console.error('SEARCH MESSAGES ERROR:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const MessageSchema = z.object({
  id: z.string(),
  text: z.string(),
  createdAt: z.date(),
  channelId: z.string(),
  channel: z.object({
    id: z.string(),
    name: z.string(),
  }),
  user: z.object({
    username: z.string(),
  }),
});

type PrismaMessage = z.infer<typeof MessageSchema>;

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json([]);
    }

    const messages = await prisma.message.findMany({
      where: {
        text: {
          contains: query,
          mode: 'insensitive',
        },
        OR: [
          {
            // Messages in public channels
            channel: {
              name: {
                not: {
                  startsWith: 'dm-'
                }
              }
            }
          },
          {
            // Messages in DM channels where user has access
            channel: {
              access: {
                some: {
                  userId
                }
              }
            }
          }
        ]
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
        channel: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });

    console.log('Search results:', { 
      query,
      resultCount: messages.length,
      results: messages.map((m: typeof messages[0]) => ({ text: m.text, channel: m.channel.name }))
    });

    const results = messages.map((m: typeof messages[0]) => ({ 
      text: m.text, 
      channel: m.channel.name,
      id: m.id,
      createdAt: m.createdAt,
      channelId: m.channelId,
      user: {
        username: m.user.username
      }
    }));

    return NextResponse.json(results);
  } catch (error) {
    console.error('SEARCH MESSAGES ERROR:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 
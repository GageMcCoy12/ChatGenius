import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { pusherServer } from '@/lib/pusher';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.userId) {
      return new Response('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { text, fileUrl, channelId, replyToId } = body;

    if (!text && !fileUrl) {
      return new Response('Message text or file is required', { status: 400 });
    }

    if (!channelId) {
      return new Response('Channel ID is required', { status: 400 });
    }

    // Create the message with optional reply
    const messageData = {
      text,
      userId: session.userId,
      channelId,
      ...(replyToId && {
        replyToId,
        isThread: true
      }),
      ...(fileUrl && {
        attachments: {
          create: [{
            fileUrl,
            fileName: 'attachment',
            fileType: 'unknown',
            fileSize: 0
          }]
        }
      })
    };

    // Create the message
    const message = await prisma.message.create({
      data: messageData,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            imageURL: true,
          },
        },
        reactions: {
          include: {
            user: true,
          },
        },
        attachments: true,
        replyTo: {
          include: {
            user: {
              select: {
                username: true,
              },
            },
          },
        },
      },
    });

    // If this is a reply, update the parent message's thread metadata
    if (replyToId) {
      // Update parent message
      const updatedParent = await prisma.message.findUnique({
        where: { id: replyToId },
        include: {
          user: true,
          attachments: true,
          reactions: {
            include: { user: true }
          },
          replies: {
            include: {
              user: true,
              attachments: true,
              reactions: {
                include: { user: true }
              }
            },
            orderBy: {
              createdAt: 'asc'
            }
          }
        }
      });

      await prisma.$executeRaw`
        UPDATE "Message"
        SET "replyCount" = (
          SELECT COUNT(*)
          FROM "Message" AS replies
          WHERE replies."replyToId" = ${replyToId}
          AND replies.id != ${replyToId}
          AND replies."isThread" = true
        ),
        "lastReplyAt" = ${new Date()}
        WHERE id = ${replyToId}
      `;

      if (updatedParent) {
        await pusherServer.trigger(channelId, `thread-${replyToId}`, message);
        await pusherServer.trigger(channelId, 'update-message', updatedParent);
      }
    }

    // Get the channel for real-time updates
    const channel = await prisma.channel.findUnique({
      where: { id: channelId },
    });

    if (!channel) {
      return new Response('Channel not found', { status: 404 });
    }

    // Only trigger new-message for non-thread messages
    if (!replyToId) {
      await pusherServer.trigger(channel.id, 'new-message', message);
    }

    return Response.json(message);
  } catch (error) {
    console.error('POST /api/messages error:', error);
    return new Response('Internal Server Error', { status: 500 });
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
        replies: {
          include: {
            user: true,
            attachments: true,
            reactions: {
              include: {
                user: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('GET MESSAGES ERROR:', error instanceof Error ? error.message : 'Unknown error');
    return new NextResponse('Internal Error', { status: 500 });
  }
} 
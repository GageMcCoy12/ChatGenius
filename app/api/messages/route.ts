import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { wsClient } from '../../../src/lib/aws-config';
import { PostToConnectionCommand } from '@aws-sdk/client-apigatewaymanagementapi';
import { User } from '@prisma/client';
import { MessageService } from '@/lib/services/message-service';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { content, channelId, replyToId } = await req.json();

    if (!content || !channelId) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        content,
        channelId,
        userId,
        replyToId,
      },
      include: {
        user: true,
        reactions: true,
      },
    });

    // If this is a reply, update the parent message's thread count
    if (replyToId) {
      const updatedParent = await prisma.message.update({
        where: { id: replyToId },
        data: {
          threadCount: {
            increment: 1,
          },
        },
        include: {
          user: true,
          reactions: true,
        },
      });

      // Get connections for the channel
      const channelUsers = await prisma.channel.findUnique({
        where: { id: channelId },
        include: { members: true },
      });

      if (channelUsers) {
        // Notify about thread update
        const connections = await prisma.connection.findMany({
          where: {
            userId: {
              in: channelUsers.members.map(m => m.userId)
            },
          },
        });

        // Send WebSocket messages
        await Promise.all(
          connections.map(async (conn) => {
            try {
              await wsClient?.send(
                new PostToConnectionCommand({
                  ConnectionId: conn.connectionId,
                  Data: Buffer.from(JSON.stringify({
                    action: 'thread-update',
                    data: {
                      messageId: replyToId,
                      threadCount: updatedParent.threadCount,
                    },
                  })),
                })
              );
            } catch (error) {
              console.error(`Failed to send to connection ${conn.connectionId}:`, error);
            }
          })
        );
      }
    }

    // Get all connections for users in the channel
    const channelUsers = await prisma.channel.findUnique({
      where: { id: channelId },
      include: { members: true },
    });

    if (channelUsers) {
      const connections = await prisma.connection.findMany({
        where: {
          userId: {
            in: channelUsers.members.map(m => m.userId),
          },
        },
      });

      // Send the new message to all connected users
      await Promise.all(
        connections.map(async (conn) => {
          try {
            await wsClient?.send(
              new PostToConnectionCommand({
                ConnectionId: conn.connectionId,
                Data: Buffer.from(JSON.stringify({
                  action: 'new-message',
                  data: message,
                })),
              })
            );
          } catch (error) {
            console.error(`Failed to send to connection ${conn.connectionId}:`, error);
          }
        })
      );
    }

    return NextResponse.json(message);
  } catch (error) {
    console.error('[MESSAGES_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
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
    const cursor = searchParams.get('cursor') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const orderBy = (searchParams.get('orderBy') as 'asc' | 'desc') || undefined;

    if (!channelId) {
      return new NextResponse('Channel ID missing', { status: 400 });
    }

    const result = await MessageService.getChannelMessages(channelId, {
      cursor,
      limit,
      orderBy,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('[MESSAGES_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 
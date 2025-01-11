import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { wsClient } from '../../../../../src/lib/aws-config';
import { PostToConnectionCommand } from '@aws-sdk/client-apigatewaymanagementapi';
import type { Connection } from '@prisma/client';

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

    // Get all connections for users in the channel
    const channelUsers = await prisma.channel.findUnique({
      where: { id: message.channelId },
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

      // Send the updated message to all connected users
      await Promise.all(
        connections.map(async (conn: Connection) => {
          try {
            await wsClient?.send(
              new PostToConnectionCommand({
                ConnectionId: conn.connectionId,
                Data: Buffer.from(JSON.stringify({
                  action: 'message-updated',
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
    console.error('[MESSAGE_REACTIONS]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 
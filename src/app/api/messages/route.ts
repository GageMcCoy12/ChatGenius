import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { ApiGatewayManagementApiClient, PostToConnectionCommand } from '@aws-sdk/client-apigatewaymanagementapi';
import { Message } from '@prisma/client';

const wsClient = new ApiGatewayManagementApiClient({
  endpoint: process.env.WEBSOCKET_API_ENDPOINT,
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { channelId, text, replyToId } = await req.json();

    if (!channelId || !text) {
      return new NextResponse('Channel ID and text are required', { status: 400 });
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        content: text,
        channelId,
        userId,
        replyToId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            imageUrl: true,
          },
        },
      },
    });

    // Get all active connections for the channel
    const channelMembers = await prisma.channel.findUnique({
      where: { id: channelId },
      include: {
        members: true,
      },
    });

    if (!channelMembers) {
      return new NextResponse('Channel not found', { status: 404 });
    }

    const connections = await prisma.connection.findMany({
      where: {
        userId: {
          in: channelMembers.members.map((member) => member.userId),
        },
      },
    });

    // Send the message to all connected users
    await Promise.allSettled(
      connections.map(async (conn) => {
        try {
          await wsClient.send(
            new PostToConnectionCommand({
              ConnectionId: conn.connectionId,
              Data: Buffer.from(JSON.stringify({
                action: 'new-message',
                data: {
                  message,
                  channelId,
                },
              })),
            })
          );
        } catch (error: any) {
          console.error(`Failed to send to connection ${conn.connectionId}:`, error);
          // Remove stale connections
          if (error.name === 'GoneException') {
            await prisma.connection.delete({
              where: { connectionId: conn.connectionId },
            });
          }
        }
      })
    );

    return NextResponse.json(message);
  } catch (error) {
    console.error('[MESSAGES_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { wsClient } from '@/lib/aws-config';
import { PostToConnectionCommand } from '@aws-sdk/client-apigatewaymanagementapi';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { name } = await req.json();

    if (!name) {
      return new NextResponse('Channel name is required', { status: 400 });
    }

    // Create the channel
    const channel = await prisma.channel.create({
      data: {
        name,
        members: {
          create: [
            { userId }
          ]
        }
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                imageUrl: true,
              }
            }
          }
        },
      },
    });

    // Get all connections to notify about the new channel
    const connections = await prisma.connection.findMany();

    // Send WebSocket messages to all connected clients
    await Promise.all(
      connections.map(async (conn) => {
        try {
          await wsClient?.send(
            new PostToConnectionCommand({
              ConnectionId: conn.connectionId,
              Data: Buffer.from(JSON.stringify({
                action: 'channel-created',
                data: channel,
              })),
            })
          );
        } catch (error) {
          // Failed to send to a connection - connection might be stale
        }
      })
    );

    return NextResponse.json(channel);
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new Response('Unauthorized', { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        channels: {
          include: {
            channel: true
          }
        }
      }
    });

    if (!user) return new Response('User not found', { status: 404 });

    const channels = await prisma.channel.findMany({
      where: {
        members: {
          some: {
            userId
          }
        }
      },
      include: {
        members: {
          include: {
            user: true
          }
        }
      }
    });

    return Response.json(channels);
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
} 
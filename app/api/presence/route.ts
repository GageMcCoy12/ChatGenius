import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { wsClient } from '@/lib/aws-config';
import { PostToConnectionCommand } from '@aws-sdk/client-apigatewaymanagementapi';

// In-memory store for active users (replace with Redis in production)
const activeUsers = new Set<string>();

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    return NextResponse.json({ activeUsers: Array.from(activeUsers) });
  } catch (error) {
    console.error('GET PRESENCE ERROR:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { status } = await req.json();

    // Get all active connections
    const connections = await prisma.connection.findMany();

    if (status === 'online') {
      activeUsers.add(userId);
      await Promise.all(connections.map(conn => 
        wsClient?.send(new PostToConnectionCommand({
          ConnectionId: conn.connectionId,
          Data: Buffer.from(JSON.stringify({ action: 'user-online', data: userId })),
        }))
      ));
    } else {
      activeUsers.delete(userId);
      await Promise.all(connections.map(conn => 
        wsClient?.send(new PostToConnectionCommand({
          ConnectionId: conn.connectionId,
          Data: Buffer.from(JSON.stringify({ action: 'user-offline', data: userId })),
        }))
      ));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('POST PRESENCE ERROR:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 
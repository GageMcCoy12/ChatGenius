import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { action, connectionId } = await req.json();

    switch (action) {
      case '$connect':
        // Store the connection
        await prisma.connection.create({
          data: {
            connectionId,
            userId,
          },
        });

        // Update user's online status
        await prisma.user.update({
          where: { id: userId },
          data: { isOnline: true },
        });
        break;

      case '$disconnect':
        // Remove the connection
        await prisma.connection.delete({
          where: { connectionId },
        });

        // Check if user has any other active connections
        const activeConnections = await prisma.connection.count({
          where: { userId },
        });

        if (activeConnections === 0) {
          // Update user's online status only if no other connections exist
          await prisma.user.update({
            where: { id: userId },
            data: { isOnline: false },
          });
        }
        break;

      default:
        return new NextResponse('Unknown action', { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[WEBSOCKET_HANDLER]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 
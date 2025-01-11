import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const activeUsers = await prisma.user.findMany({
      where: {
        isOnline: true,
      },
      select: {
        id: true,
        username: true,
        imageUrl: true,
      },
    });

    return NextResponse.json(activeUsers);
  } catch (error) {
    console.error('[ACTIVE_USERS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { connectionId } = await req.json();
    if (!connectionId) {
      return new NextResponse('Missing connectionId', { status: 400 });
    }

    // Store the connection ID
    await prisma.connection.create({
      data: {
        connectionId,
        userId,
      },
    });

    // Update user status
    await prisma.user.update({
      where: { id: userId },
      data: { isOnline: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[ACTIVE_USERS_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { connectionId } = await req.json();
    if (!connectionId) {
      return new NextResponse('Missing connectionId', { status: 400 });
    }

    // Remove the connection
    await prisma.connection.delete({
      where: {
        connectionId,
      },
    });

    // Check if user has any other active connections
    const remainingConnections = await prisma.connection.count({
      where: {
        userId,
      },
    });

    // If no other connections, mark user as offline
    if (remainingConnections === 0) {
      await prisma.user.update({
        where: { id: userId },
        data: { isOnline: false },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[ACTIVE_USERS_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 
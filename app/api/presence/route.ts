import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { pusherServer } from '@/lib/pusher';

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

    if (status === 'online') {
      activeUsers.add(userId);
      await pusherServer.trigger('presence', 'user-online', userId);
    } else {
      activeUsers.delete(userId);
      await pusherServer.trigger('presence', 'user-offline', userId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('POST PRESENCE ERROR:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 
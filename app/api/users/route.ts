import { NextResponse } from 'next/server';
import { currentProfile } from '@/lib/current-profile';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Ensure user is authenticated
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Fetch all users with their online status
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        imageUrl: true,
        status: true,
      },
      orderBy: {
        username: 'asc'
      }
    });

    // Transform the data to include isOnline
    const transformedUsers = users.map(user => ({
      id: user.id,
      username: user.username,
      imageUrl: user.imageUrl,
      isOnline: user.status === "ACTIVE"
    }));

    return NextResponse.json(transformedUsers);
  } catch (error) {
    console.error('[USERS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 
import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

async function generateUniqueUsername(baseUsername: string): Promise<string> {
  let username = baseUsername;
  let counter = 1;
  
  while (true) {
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });
    
    if (!existingUser) {
      return username;
    }
    
    username = `${baseUsername}${counter}`;
    counter++;
  }
}

export async function POST() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await currentUser();

    if (!user || !user.emailAddresses || user.emailAddresses.length === 0) {
      return new NextResponse('Invalid user data', { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (existingUser) {
      return NextResponse.json(existingUser);
    }

    // Generate unique username
    const baseUsername = user.username || user.emailAddresses[0].emailAddress.split('@')[0];
    const uniqueUsername = await generateUniqueUsername(baseUsername);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        id: userId,
        email: user.emailAddresses[0].emailAddress,
        username: uniqueUsername,
        imageUrl: user.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
        isOnline: true,
        roleId: "1", // Default role ID
      },
    });

    // Find the team-updates channel
    const channel = await prisma.channel.findFirst({
      where: { name: 'team-updates' }
    });

    if (channel) {
      // Add user to the team-updates channel
      await prisma.channelMember.create({
        data: {
          userId: newUser.id,
          channelId: channel.id,
        }
      });
    }

    return NextResponse.json(newUser);
  } catch (error: any) {
    const errorDetails = {
      name: error?.name || 'Unknown Error',
      message: error?.message || 'An unknown error occurred',
      stack: error?.stack || ''
    };
    return new NextResponse(JSON.stringify({ error: errorDetails.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 
import { NextResponse } from 'next/server';
import { clerkClient as clerk } from '@clerk/clerk-sdk-node';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // Get all users from Clerk
    const clerkUsers = await clerk.users.getUserList();
    
    // Format users to match our needs
    const users = clerkUsers.data.map((user: { id: string; username: string | null; imageUrl: string }) => ({
      id: user.id,
      username: user.username || `user${user.id.slice(0, 4)}`,
      imageURL: user.imageUrl,
    }));

    return NextResponse.json(users);
  } catch (error) {
    console.error('GET USERS ERROR:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 
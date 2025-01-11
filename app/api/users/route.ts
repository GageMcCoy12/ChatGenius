import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const users = await prisma.user.findMany({
      include: {
        role: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('GET USERS ERROR:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 
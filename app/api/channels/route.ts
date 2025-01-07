import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { name, description } = await req.json();

    if (!name) {
      return new NextResponse('Channel name is required', { status: 400 });
    }

    // Create the channel
    const channel = await prisma.channel.create({
      data: {
        name,
        description,
        access: {
          create: {
            userId,
            role: 'owner',
          },
        },
      },
      include: {
        access: {
          include: {
            user: true,
          },
        },
      },
    });

    return NextResponse.json(channel);
  } catch (error) {
    console.error('CREATE CHANNEL ERROR:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const channels = await prisma.channel.findMany({
      include: {
        access: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(channels);
  } catch (error) {
    console.error('GET CHANNELS ERROR:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 
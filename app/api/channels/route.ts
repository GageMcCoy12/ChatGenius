import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

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

    return NextResponse.json(channel);
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse('Unauthorized', { status: 401 });

    const channels = await prisma.channel.findMany({
      include: {
        members: {
          include: {
            user: true
          }
        }
      }
    });

    return NextResponse.json(channels);
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 
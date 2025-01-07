import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { pusherServer } from '@/lib/pusher';

export async function POST(req: Request) {
  try {
    console.log('POST /api/messages: Starting request');
    
    // Log auth attempt
    console.log('POST /api/messages: Attempting authentication');
    const authResult = await auth();
    console.log('POST /api/messages: Auth result:', { userId: authResult.userId });
    
    const { userId } = authResult;
    if (!userId) {
      console.error('POST /api/messages: Unauthorized - No userId');
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Log request body parsing
    const rawBody = await req.text();
    console.log('POST /api/messages: Raw request body:', rawBody);
    
    let body;
    try {
      body = JSON.parse(rawBody);
    } catch (e) {
      console.error('POST /api/messages: JSON parse error:', e);
      return new NextResponse('Invalid JSON body', { status: 400 });
    }
    
    console.log('POST /api/messages: Parsed request body:', body);
    
    const { text, channelId, fileUrl } = body;

    if (!text || !channelId) {
      console.error('POST /api/messages: Missing fields:', { text, channelId });
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Log Pusher server state
    console.log('POST /api/messages: Pusher server config:', {
      hasAppId: !!process.env.PUSHER_APP_ID,
      hasKey: !!process.env.PUSHER_KEY,
      hasSecret: !!process.env.PUSHER_SECRET,
      hasCluster: !!process.env.PUSHER_CLUSTER,
    });

    console.log('POST /api/messages: Creating message');
    const message = await prisma.message.create({
      data: {
        text,
        channelId,
        userId,
        ...(fileUrl && {
          attachments: {
            create: {
              fileUrl,
              fileType: fileUrl.includes('.pdf') ? 'application/pdf' : 'image/jpeg',
              fileName: fileUrl.split('/').pop() || 'file',
            },
          },
        }),
      },
      include: {
        user: true,
        attachments: true,
        reactions: {
          include: {
            user: true
          }
        },
      },
    });

    console.log('POST /api/messages: Message created, triggering Pusher');
    await pusherServer.trigger(channelId, 'new-message', message);

    console.log('POST /api/messages: Success');
    return NextResponse.json(message);
  } catch (error) {
    console.error('POST /api/messages: Error:', {
      error,
      name: error instanceof Error ? error.name : 'Unknown error type',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return new NextResponse(
      error instanceof Error ? error.message : 'Internal Server Error',
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const channelId = searchParams.get('channelId');

    if (!channelId) {
      return new NextResponse('Channel ID required', { status: 400 });
    }

    const messages = await prisma.message.findMany({
      where: {
        channelId,
      },
      include: {
        user: true,
        attachments: true,
        reactions: {
          include: {
            user: true
          }
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('GET MESSAGES ERROR:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { WebhookEvent } from '@clerk/nextjs/server'

console.log('=== WEBHOOK ROUTE LOADED ===');

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

export async function POST(req: Request) {
  console.log('=== WEBHOOK ENDPOINT HIT ===');
  console.log('Request method:', req.method);
  console.log('Request URL:', req.url);

  try {
    console.log('🔔 Webhook received');
    const payload = await req.json()
    console.log('📦 Payload:', JSON.stringify(payload, null, 2));
    const body = JSON.stringify(payload);
    
    const headersList = await headers();
    const svix_id = headersList.get('svix-id') || '';
    const svix_timestamp = headersList.get('svix-timestamp') || '';
    const svix_signature = headersList.get('svix-signature') || '';

    if (!svix_id || !svix_timestamp || !svix_signature) {
      console.error('❌ Missing headers:', { svix_id, svix_timestamp, svix_signature });
      return new NextResponse('Missing svix headers', { status: 400 });
    }

    if (!process.env.CLERK_WEBHOOK_SECRET) {
      console.error('❌ Missing CLERK_WEBHOOK_SECRET environment variable');
      return new NextResponse('Configuration error', { status: 500 });
    }

    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    let evt: WebhookEvent;

    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
      console.log('✅ Webhook verified');
    } catch (err) {
      console.error('❌ Error verifying webhook:', err);
      return new NextResponse('Error verifying webhook', { status: 400 });
    }

    console.log(`🎯 Processing ${evt.type} event`);

    // Handle user.created event
    if (evt.type === 'user.created') {
      try {
        const userData = evt.data;
        console.log('👤 User data:', JSON.stringify(userData, null, 2));

        // Generate a unique username
        const baseUsername = userData.username || userData.email_addresses[0]?.email_address?.split('@')[0] || `user_${userData.id.slice(0, 8)}`;
        const uniqueUsername = await generateUniqueUsername(baseUsername);
        console.log('📝 Generated unique username:', uniqueUsername);

        // Create user in database
        try {
          const user = await prisma.user.create({
            data: {
              id: userData.id,
              email: userData.email_addresses[0]?.email_address,
              username: uniqueUsername,
              imageUrl: userData.image_url,
              isOnline: true,
              status: "DEFAULT",
              roleId: '1'
            }
          });
          console.log('💾 User created:', user);

          // Add user to default channels
          const defaultChannels = await prisma.channel.findMany({
            where: {
              name: {
                in: ['general', 'team-updates']
              }
            }
          });

          if (defaultChannels.length === 0) {
            console.log('⚠️ No default channels found. Creating them...');
            // Create default channels if they don't exist
            for (const channelName of ['general', 'team-updates']) {
              const channel = await prisma.channel.create({
                data: {
                  name: channelName,
                  members: {
                    create: [
                      { userId: user.id }
                    ]
                  }
                }
              });
              console.log(`📢 Created channel: ${channelName}`);
            }
          } else {
            // Add user to existing default channels
            for (const channel of defaultChannels) {
              await prisma.channelMember.create({
                data: {
                  userId: user.id,
                  channelId: channel.id
                }
              });
              console.log(`📢 Added user to channel: ${channel.name}`);
            }
          }

          return NextResponse.json({ 
            success: true,
            user: {
              id: user.id,
              username: user.username,
              email: user.email
            }
          });
        } catch (error) {
          console.error('❌ Error creating user:', error);
          // Check if it's a unique constraint error
          if (error.code === 'P2002') {
            return new NextResponse('User already exists', { status: 409 });
          }
          return new NextResponse('Error creating user', { status: 500 });
        }
      } catch (error) {
        console.error('❌ Error processing user.created event:', error);
        return new NextResponse('Error processing user.created event', { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    return new NextResponse('Webhook error', { status: 500 });
  }
} 
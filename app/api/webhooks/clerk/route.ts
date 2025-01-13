import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { WebhookEvent } from '@clerk/nextjs/server'

console.log('=== WEBHOOK ROUTE LOADED ===');

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

    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');
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

        // Test database connection
        try {
          await prisma.$connect();
          console.log('✅ Database connection successful');
        } catch (error) {
          console.error('❌ Database connection failed:', error);
          return new NextResponse('Database connection failed', { status: 500 });
        }

        // Ensure default role exists
        try {
          const defaultRole = await prisma.role.upsert({
            where: { id: '1' },
            create: {
              id: '1',
              name: 'user'
            },
            update: {}
          });
          console.log('👑 Default role:', defaultRole);
        } catch (error) {
          console.error('❌ Error creating default role:', error);
          return new NextResponse('Error creating default role', { status: 500 });
        }

        // Create user in database
        try {
          const user = await prisma.user.create({
            data: {
              id: userData.id,
              email: userData.email_addresses[0]?.email_address,
              username: userData.username || userData.email_addresses[0]?.email_address?.split('@')[0],
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

          for (const channel of defaultChannels) {
            await prisma.channelMember.create({
              data: {
                userId: user.id,
                channelId: channel.id
              }
            });
            console.log(`📢 Added user to channel: ${channel.name}`);
          }

          return NextResponse.json({ success: true });
        } catch (error) {
          console.error('❌ Error creating user:', error);
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
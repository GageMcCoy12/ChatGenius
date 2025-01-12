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

    const wh = new Webhook(process.env.CLERK_SECRET_KEY || '');
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

    // Handle both user.created and session.created events
    if (evt.type === 'user.created' || evt.type === 'session.created') {
      try {
        // Get user data based on event type
        const userData = evt.type === 'user.created' 
          ? evt.data 
          : (evt.data as any).user;

        console.log('👤 User data:', JSON.stringify(userData, null, 2));

        // Upsert user to handle both new users and sessions
        const user = await prisma.user.upsert({
          where: { id: userData.id },
          create: {
            id: userData.id,
            email: userData.email_addresses[0].email_address,
            username: userData.username || userData.email_addresses[0].email_address.split('@')[0],
            imageUrl: userData.image_url,
            isOnline: true,
            roleId: "1",
          },
          update: {
            isOnline: true,
            email: userData.email_addresses[0].email_address,
            username: userData.username || undefined,
            imageUrl: userData.image_url || undefined,
          },
        });
        console.log('💾 User upserted:', user);

        // For new users (user.created), add them to team-updates channel
        if (evt.type === 'user.created') {
          console.log('🔍 Looking for team-updates channel');
          const channel = await prisma.channel.findFirst({
            where: { name: 'team-updates' }
          });

          if (channel) {
            console.log('📢 Adding user to team-updates channel');
            const member = await prisma.channelMember.create({
              data: {
                userId: user.id,
                channelId: channel.id,
              }
            });
            console.log('✨ Added to channel:', member);
          }
        }

        return new NextResponse(`User ${evt.type === 'user.created' ? 'created' : 'updated'}`, { status: 200 });
      } catch (error) {
        console.error('❌ Database error:', error);
        return new NextResponse('Database error', { status: 500 });
      }
    }

    return new NextResponse('Webhook received', { status: 200 });
  } catch (error) {
    console.error('❌ Webhook handler error:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 
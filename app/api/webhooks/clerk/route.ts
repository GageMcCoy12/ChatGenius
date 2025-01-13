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
  console.log('📨 Clerk webhook received');
  
  // Get the headers
  const headersList = headers();
  const svix_id = headersList.get("svix-id");
  const svix_timestamp = headersList.get("svix-timestamp");
  const svix_signature = headersList.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('❌ Error: Missing svix headers');
    return new NextResponse('Error occured -- no svix headers', {
      status: 400
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');

  let evt: WebhookEvent;

  // Verify the webhook
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('❌ Error verifying webhook:', err);
    return new NextResponse('Error occured', {
      status: 400
    });
  }

  // Handle the webhook
  const eventType = evt.type;
  console.log(`📣 Webhook event type: ${eventType}`);

  if (eventType === 'user.created') {
    const { id, email_addresses, username, image_url } = evt.data;
    
    console.log('👤 Creating user:', {
      id,
      email: email_addresses[0]?.email_address,
      username: username || email_addresses[0]?.email_address?.split('@')[0],
      imageUrl: image_url
    });

    try {
      // Create the user in the database
      const user = await prisma.user.create({
        data: {
          id,
          email: email_addresses[0]?.email_address,
          username: username || email_addresses[0]?.email_address?.split('@')[0],
          imageUrl: image_url,
          roleId: '1', // Default role ID
        },
      });

      console.log('✅ User created successfully:', user);

      // Add user to default channels
      const defaultChannels = await prisma.channel.findMany({
        where: {
          name: {
            in: ['general', 'team-updates']
          }
        }
      });

      // Create default channels if they don't exist
      if (defaultChannels.length === 0) {
        console.log('📢 Creating default channels...');
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
          console.log(`✅ Created channel: ${channelName}`);
        }
      } else {
        // Add user to existing default channels
        console.log('📢 Adding user to default channels...');
        for (const channel of defaultChannels) {
          await prisma.channelMember.create({
            data: {
              userId: user.id,
              channelId: channel.id
            }
          });
          console.log(`✅ Added user to channel: ${channel.name}`);
        }
      }

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('❌ Error creating user:', error);
      return new NextResponse('Error creating user', { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
} 
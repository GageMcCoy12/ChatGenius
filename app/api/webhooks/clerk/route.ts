import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const payload = await req.json()
    
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new NextResponse('Missing svix headers', { status: 400 });
    }

    // Only handle user.created events for now
    if (payload.type === 'user.created') {
      const { id, email_addresses, username, image_url } = payload.data

      // Create user with default role
      const user = await prisma.user.create({
        data: {
          id,
          email: email_addresses[0].email_address,
          username: username || email_addresses[0].email_address.split('@')[0],
          imageUrl: image_url,
          isOnline: false,
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
            userId: user.id,
            channelId: channel.id,
          }
        });
      }

      return new NextResponse('User created and added to team-updates', { status: 200 });
    }

    return new NextResponse('Webhook received', { status: 200 });
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 });
  }
} 
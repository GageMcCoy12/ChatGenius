import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const payload = await req.json()
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response('Missing svix headers', { status: 400 })
    }

    // Only handle user.created events for now
    if (payload.type === 'user.created') {
      const { id, email_addresses, username, image_url } = payload.data

      // Create user with default role
      await prisma.user.create({
        data: {
          id,
          email: email_addresses[0].email_address,
          username: username || email_addresses[0].email_address.split('@')[0],
          imageURL: image_url,
          roleId: 1,
        },
      })

      return new Response('User created', { status: 200 })
    }

    return new Response('Webhook received', { status: 200 })
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response('Webhook error', { status: 400 })
  }
} 
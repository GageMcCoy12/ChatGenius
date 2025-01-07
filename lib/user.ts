import { prisma } from '@/lib/db'
import { auth, getAuth } from '@clerk/nextjs/server'

export async function getOrCreateUser() {
  // Step 1: Get the user's ID from Clerk
  const { userId } = await auth()
  
  // Step 2: If there's no userId, the user isn't logged in
  if (!userId) {
    return null
  }

  // Step 3: Try to find the user in our database
  let user = await prisma.user.findUnique({
    where: { id: userId }
  })

  // Step 4: If we don't find the user, let's create them!
  if (!user) {
    // Get more information about the user from Clerk
    const response = await fetch('https://api.clerk.com/v1/users/' + userId, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    })
    const clerkUser = await response.json()

    // Create the user in our database
    user = await prisma.user.create({
      data: {
        id: userId,
        email: clerkUser.email_addresses[0].email_address,
        username: clerkUser.username || clerkUser.email_addresses[0].email_address.split('@')[0],
        imageURL: clerkUser.image_url,
        roleId: 1, // Default role ID for new users
      }
    })
  }

  return user
} 
import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST() {
  console.log('📝 Processing sign-in request')
  try {
    const { userId } = await auth()
    if (!userId) {
      console.error('❌ No userId found in auth context')
      return new NextResponse('Unauthorized', { status: 401 })
    }
    console.log('🔑 Authenticated userId:', userId)

    // Get user from Clerk
    const user = await currentUser()
    if (!user) {
      console.error('❌ No user found in Clerk')
      return new NextResponse('User not found', { status: 404 })
    }
    console.log('👤 Clerk user found:', user.id)

    // Get or create default role
    const defaultRole = await prisma.role.findFirst({
      where: { name: 'user' }
    }) || await prisma.role.create({
      data: { name: 'user' }
    })
    console.log('👑 User role:', defaultRole.name)

    // Ensure we have an email
    const primaryEmail = user.emailAddresses[0]?.emailAddress
    if (!primaryEmail) {
      console.error('❌ No email address found for user')
      return new NextResponse('Email address required', { status: 400 })
    }

    // Sync user with database
    const dbUser = await prisma.user.upsert({
      where: { id: userId },
      create: {
        id: userId,
        username: user.username || `user_${userId.slice(0, 8)}`,
        email: primaryEmail,
        imageUrl: user.imageUrl,
        roleId: defaultRole.id,
        isOnline: true,
      },
      update: {
        username: user.username || undefined,
        email: primaryEmail,
        imageUrl: user.imageUrl || undefined,
        isOnline: true,
      }
    })
    console.log('✅ User synchronized with database:', dbUser.id)

    return NextResponse.json({ 
      user: dbUser,
      message: 'Sign in successful'
    })
  } catch (error) {
    console.error('❌ Error in sign-in callback:', error)
    return new NextResponse(
      JSON.stringify({ 
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }), 
      { status: 500 }
    )
  }
} 
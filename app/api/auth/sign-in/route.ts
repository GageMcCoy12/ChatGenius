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
    console.log('🎭 Finding or creating default role...')
    const defaultRole = await prisma.role.upsert({
      where: { id: '1' },
      update: {},
      create: {
        id: '1',
        name: 'user'
      }
    })
    console.log('👑 User role created/found:', defaultRole)

    // Ensure we have an email
    const primaryEmail = user.emailAddresses[0]?.emailAddress
    if (!primaryEmail) {
      console.error('❌ No email address found for user')
      return new NextResponse('Email address required', { status: 400 })
    }
    console.log('📧 User email:', primaryEmail)

    // Sync user with database
    console.log('🔄 Syncing user with database...')
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
    console.log('✅ User synchronized with database:', dbUser)

    // Add user to default channels
    console.log('📢 Adding user to default channels...')
    const defaultChannels = await prisma.channel.findMany({
      where: {
        name: {
          in: ['general', 'team-updates']
        }
      }
    })

    // Create default channels if they don't exist
    if (defaultChannels.length === 0) {
      console.log('🆕 Creating default channels...')
      for (const channelName of ['general', 'team-updates']) {
        const channel = await prisma.channel.create({
          data: {
            name: channelName,
            members: {
              create: [
                { userId: dbUser.id }
              ]
            }
          }
        })
        console.log(`✅ Created channel: ${channelName}`)
      }
    } else {
      // Add user to existing default channels
      console.log('➕ Adding user to existing default channels...')
      for (const channel of defaultChannels) {
        await prisma.channelMember.create({
          data: {
            userId: dbUser.id,
            channelId: channel.id
          }
        }).catch(error => {
          // Ignore if user is already a member
          if (!error.code?.includes('P2002')) {
            throw error
          }
        })
        console.log(`✅ Added user to channel: ${channel.name}`)
      }
    }

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
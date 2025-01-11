import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Testing database queries...\n')

  // Test user query
  console.log('Looking for users...')
  const users = await prisma.user.findMany({
    include: {
      channels: true,
    }
  })
  console.log('Users found:', users.length)
  console.log(JSON.stringify(users, null, 2))

  // Test channel query
  console.log('\nLooking for channels...')
  const channels = await prisma.channel.findMany({
    include: {
      members: true,
      messages: true,
    }
  })
  console.log('Channels found:', channels.length)
  console.log(JSON.stringify(channels, null, 2))

  // Test message query
  console.log('\nLooking for messages...')
  const messages = await prisma.message.findMany({
    include: {
      user: true,
      channel: true,
    }
  })
  console.log('Messages found:', messages.length)
  console.log(JSON.stringify(messages, null, 2))
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 
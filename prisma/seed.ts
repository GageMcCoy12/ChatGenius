import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clean up existing data
  await prisma.message.deleteMany();
  await prisma.channelMember.deleteMany();
  await prisma.channel.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();

  // Create a default role
  const userRole = await prisma.role.create({
    data: {
      name: 'user'
    }
  });

  // Create test users
  const alice = await prisma.user.create({
    data: {
      id: 'user_alice',
      username: 'Alice',
      email: 'alice@example.com',
      imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
      roleId: userRole.id
    },
  });

  const bob = await prisma.user.create({
    data: {
      id: 'user_bob',
      username: 'Bob',
      email: 'bob@example.com',
      imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
      roleId: userRole.id
    },
  });

  // Create a test channel
  const channel = await prisma.channel.create({
    data: {
      name: 'General',
    },
  });

  // Add users to channel
  await prisma.channelMember.createMany({
    data: [
      { userId: alice.id, channelId: channel.id },
      { userId: bob.id, channelId: channel.id },
    ],
  });

  // Create some test messages
  await prisma.message.create({
    data: {
      content: 'Hello everyone! 👋',
      userId: alice.id,
      channelId: channel.id,
    },
  });

  await prisma.message.create({
    data: {
      content: 'Hi Alice! How are you?',
      userId: bob.id,
      channelId: channel.id,
    },
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
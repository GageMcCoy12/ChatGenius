import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create default user role if it doesn't exist
  const defaultRole = await prisma.userRole.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'User',
      permissions: ['READ', 'WRITE'],
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 
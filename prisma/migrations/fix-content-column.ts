import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Update all existing messages that have empty content
  await prisma.message.updateMany({
    where: {
      content: ""
    },
    data: {
      content: "No content" // Default content for existing messages
    }
  })

  // Verify all messages have content
  const emptyMessages = await prisma.message.count({
    where: {
      content: ""
    }
  })

  console.log(`Messages updated. ${emptyMessages} messages still with empty content.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 
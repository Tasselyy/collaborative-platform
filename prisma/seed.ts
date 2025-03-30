// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // 1) Test user #1
  await prisma.user.create({
    data: {
      email: 'alice@example.com',
      name: 'Alice Wonderland',
      // Hash the password so credentials-based login will work
      password: await bcrypt.hash('password123', 10),
    },
  })

  // 2) Test user #2
  await prisma.user.create({
    data: {
      email: 'bob@example.com',
      name: 'Bob Builder',
      password: await bcrypt.hash('password123', 10),
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

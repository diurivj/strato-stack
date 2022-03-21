import { PrismaClient } from '@prisma/client'
import bcrypt from '@node-rs/bcrypt'

const prisma = new PrismaClient()

async function seed() {
  const email = 'diego@diego.com'
  const name = 'diego'

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  })

  const hashedPassword = await bcrypt.hash('diego', 10)

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: {
        create: {
          hash: hashedPassword
        }
      }
    }
  })

  console.log(`User created:`, { user })
  console.log(`Database has been seeded. 🌱`)
}

seed()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

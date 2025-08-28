import { PrismaClient } from '@prisma/client'
import path from 'path'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Get the current directory and construct absolute path to database
const getCurrentDir = () => {
  return process.cwd()
}

const databasePath = process.env.DATABASE_URL || 
  `file:${path.join(getCurrentDir(), 'db', 'custom.db')}`

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
    datasources: {
      db: {
        url: databasePath
      }
    }
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
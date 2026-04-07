import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { logger } from './logger'

const connectionString = `${process.env.DATABASE_URL}`

const prismaClientSingleton = () => {
  try {
    if (!process.env.DATABASE_URL) {
      logger.error('DATABASE_URL is missing from environment variables.');
    }

    const pool = new Pool({ connectionString })
    const adapter = new PrismaPg(pool)

    return new PrismaClient({ adapter })
  } catch (err: any) {
    logger.error('CRITICAL_DATABASE_INIT_FAILURE:', err);
    throw err;
  }
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

export const prisma = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma

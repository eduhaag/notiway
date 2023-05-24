import { env } from '@/env'
import { MongoMemoryServer } from 'mongodb-memory-server'

export async function mongoConfig() {
  if (env.NODE_ENV === 'test') {
    const mongoMemory = await MongoMemoryServer.create()

    return mongoMemory.getUri()
  }

  return env.MONGO_DATABASE_URL
}

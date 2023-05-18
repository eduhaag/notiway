import { env } from '@/env'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

export async function connectToMongoDB(): Promise<typeof mongoose> {
  let uri

  if (env.NODE_ENV === 'test') {
    const mongoServer = await MongoMemoryServer.create({
      binary: { version: '6.0.4' },
    })

    uri = mongoServer.getUri()
  } else {
    uri = env.MONGO_DATABASE_URL
  }

  console.log('✅ Connected to MongoDB')

  return await mongoose.connect(uri, { dbName: 'notiway' })
}

export const Message = mongoose.model(
  'messages',
  new mongoose.Schema({
    client_id: String,
    sender_name: String,
    to: String,
    content: Object,
    sended_at: Date,
  }),
)

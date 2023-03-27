import { env } from '@/env'
import mongoose from 'mongoose'

export async function connectToMongoDB() {
  await mongoose.connect(env.MONGO_DATABASE_URL, { dbName: 'zpi_mongo' })

  console.log('✅ Connected to MongoDB')
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

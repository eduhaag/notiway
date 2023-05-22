import { env } from '@/env'
import { errorHandler } from '@/error-handler'
import { MongoClient } from 'mongodb'

export class MongoDb {
  private _client!: MongoClient

  constructor() {
    this._client = new MongoClient(env.MONGO_DATABASE_URL)

    this.connect()
  }

  private async connect() {
    try {
      await this._client.connect()
      console.log('✅ Connected to MongoDB')
    } catch (error: any) {
      errorHandler(error)
    }
  }

  get client() {
    return this._client
  }
}

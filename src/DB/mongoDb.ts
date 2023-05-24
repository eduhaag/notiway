import { env } from '@/env'
import { errorHandler } from '@/error-handler'
import { MongoClient } from 'mongodb'
import { MongoMemoryServer } from 'mongodb-memory-server'

export class MongoDb {
  private _client!: MongoClient
  private _uri!: string

  async connect() {
    if (env.NODE_ENV === 'test') {
      const mongoD = await MongoMemoryServer.create({
        instance: { dbName: 'notiway' },
        binary: {
          version: '6.0.6',
        },
      })
      this._uri = mongoD.getUri() + 'notiway'
    } else {
      this._uri = env.MONGO_DATABASE_URL
    }

    this._client = new MongoClient(this._uri)

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

  get uri() {
    return this._uri
  }
}

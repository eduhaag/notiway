import { Message } from '@/DTOS/message-types'
import { MessagesRepository } from '../messages-repository'
import { mongoDb } from '@/app'
import { Collection, InsertOneResult, MongoClient } from 'mongodb'

export class MongoMessagesRepository implements MessagesRepository {
  private client: MongoClient
  private messageCollection: Collection

  constructor() {
    this.client = mongoDb.client

    this.messageCollection = this.client.db('notiway').collection('messages')
  }

  async create(data: Message): Promise<InsertOneResult> {
    return await this.messageCollection!.insertOne(data)
  }
}

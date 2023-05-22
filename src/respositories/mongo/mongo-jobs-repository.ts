import { JobsRepository } from '../jobs-repository'
import { Collection, MongoClient, ObjectId } from 'mongodb'
import { mongoDb } from '@/app'

export class MongoJobsRepository implements JobsRepository {
  private client: MongoClient
  private jobsCollection: Collection

  constructor() {
    this.client = mongoDb.client
    this.jobsCollection = this.client.db('notiway').collection('agendaJobs')
  }

  async get(id: string): Promise<any> {
    return await this.jobsCollection.findOne({ _id: new ObjectId(id) })
  }

  async delete(id: string): Promise<any> {
    await this.jobsCollection.deleteOne({ _id: new ObjectId(id) })
  }
}

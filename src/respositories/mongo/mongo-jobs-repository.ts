import { Job, JobsRepository } from '../jobs-repository'
import { Collection, InsertOneResult, MongoClient, ObjectId } from 'mongodb'
import { mongoDb } from '@/app'

export class MongoJobsRepository implements JobsRepository {
  private client: MongoClient
  private jobsCollection: Collection

  constructor() {
    this.client = mongoDb.client
    this.jobsCollection = this.client.db('notiway').collection('agendaJobs')
  }

  async findById(id: string) {
    return await this.jobsCollection.findOne({ _id: new ObjectId(id) })
  }

  async deleteById(id: string) {
    await this.jobsCollection.deleteOne({ _id: new ObjectId(id) })
  }

  async create(job: Job): Promise<InsertOneResult> {
    return await this.jobsCollection.insertOne(job)
  }
}

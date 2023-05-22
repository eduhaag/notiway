import { JobsRepository, UpdateJobProps } from '../jobs-repository'
import { Collection, MongoClient, ObjectId } from 'mongodb'
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

  async update(data: UpdateJobProps): Promise<any> {
    await this.jobsCollection.updateOne(
      { _id: new ObjectId(data.scheduleId) },
      { nextRunAt: data.sendOn },
    )
  }
}

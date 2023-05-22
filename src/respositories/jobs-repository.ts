import { Document, InsertOneResult, WithId } from 'mongodb'

export interface Job {
  name: string
  data: any
  type: string
  repeatInterval?: string
  repeatTimezone?: string
  nextRunAt?: Date
  lastRunAt?: Date
  lockedAt?: Date
  lastFinishedAt?: Date
  failCount?: number
  failedAt?: Date
  failReason?: string
}

export interface JobsRepository {
  findById(id: string): Promise<WithId<Document> | null>
  deleteById(id: string): Promise<void>
  create(job: Job): Promise<InsertOneResult>
}

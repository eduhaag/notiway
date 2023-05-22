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
  get(id: string): Promise<Job>
  delete(id: string): Promise<void>
}

import { Message } from '@/DTOS/message-types'
import Agenda, { Job } from 'agenda'
import { sendMessage } from './jobs/send-message-job'
import { SendMailProps } from '../mail-provider/email-provider'
import { sendMail } from './jobs/send-mail-job'
import { errorHandler } from '@/error-handler'
import { ObjectId } from 'mongodb'
import { MongoDb } from '@/DB/mongoDb'
import { agendaJobToDomain } from './mappers/agenda-job-to-domain'

interface AddJobProps {
  queue: string
  date: Date
  data: any
}

export interface JobAttributes {
  id: string
  name: string
  data: any
  priority: number | string
  shouldSaveResult?: boolean
  type: string
  nextRunAt?: Date | null
  lastModifiedBy?: string
  lastRunAt?: Date | null
  failCount?: number
  failReason?: string
  failedAt?: Date | null
  lastFinishedAt?: Date | null
}

export interface JobUpdateProps {
  jobId: string
  to?: string
  sendOn?: Date
}

export class QueuesProvider {
  private _agenda!: Agenda
  private mongo: MongoDb

  constructor() {
    this.mongo = new MongoDb()

    this.start()
  }

  private async start() {
    await this.mongo.connect()

    this._agenda = new Agenda({
      db: { address: this.mongo.uri },
      maxConcurrency: 5,
    })

    this._agenda.on('ready', () => {
      console.log('✅ Queues starded.')
    })

    await this._agenda.start()
    this.jobsConfig()
  }

  get agenda() {
    return this._agenda
  }

  async add({ date, data, queue }: AddJobProps): Promise<string> {
    const job = await this._agenda.schedule(date, queue, data)

    return job.attrs._id.toString()
  }

  async findJobById(id: string): Promise<JobAttributes | undefined> {
    const job = await this._agenda.jobs({ _id: new ObjectId(id) })

    if (job.length === 0) {
      return undefined
    }

    return { ...agendaJobToDomain(job[0].attrs) }
  }

  async findJobByClientId(clientId: string): Promise<JobAttributes[]> {
    const jobs = await this._agenda.jobs({ 'data.clientId': clientId })

    return jobs.map((job) => {
      return agendaJobToDomain(job.attrs)
    })
  }

  async deleteJob(jobId: string) {
    const job = await this._agenda.jobs({ _id: new ObjectId(jobId) })

    await job[0].remove()
  }

  async runJob(jobId: string) {
    const job = await this._agenda.jobs({ _id: new ObjectId(jobId) })

    await job[0].run()
  }

  async runFailedJobs(clientId?: string) {
    const filter = clientId
      ? { $and: [{ failCount: { $gte: 3 } }, { 'data.clientId': clientId }] }
      : { failCount: { $gte: 3 } }

    const jobs = await this._agenda.jobs(filter)

    jobs.forEach((job) => {
      job.run()
    })
  }

  async jobUpdate({ jobId, sendOn, to }: JobUpdateProps) {
    const job = await this._agenda.jobs({ _id: new ObjectId(jobId) })

    if (sendOn) {
      job[0].schedule(sendOn)
    }

    if (to) {
      job[0].attrs.data.to = to
    }

    job[0].save()
  }

  private async completeJob(job: Job) {
    if (job.attrs.name === 'send-message') {
      const { clientId, senderName, to, content, apiToken } = job.attrs
        .data as Message

      await this.mongo.client.db('notiway').collection('messages').insertOne({
        clientId,
        apiToken,
        senderName,
        to,
        content,
        sendedOn: new Date(),
      })
    }

    await job.remove()
  }

  private async jobErrorHandler(err: any, job: Job) {
    const MAX_RETRIES = 3 // max job retries
    const currentRetries = job.attrs.failCount || 0

    if (currentRetries < MAX_RETRIES) {
      const DELAY = 5 // Time between job retries
      await job.schedule(`in ${DELAY} seconds`).save()
    }

    errorHandler(err)
  }

  private jobsConfig() {
    this._agenda.define('send-message', async (job: Job) => {
      await sendMessage(job.attrs.data as Message, job.attrs._id.toString())
    })

    this._agenda.define('send-mail', async (job: Job) => {
      await sendMail(job.attrs.data as SendMailProps)
    })

    this._agenda.on('success', (job: Job) => {
      this.completeJob(job)
    })

    this._agenda.on('fail', async (err: any, job: Job) => {
      await this.jobErrorHandler(err, job)
    })
  }
}

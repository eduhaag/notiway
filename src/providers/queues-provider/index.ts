import { Message } from '@/DTOS/message-types'
import Agenda, { Job } from 'agenda'
import { sendMessage } from './jobs/send-message-job'
import { SendMailProps } from '../mail-provider/email-provider'
import { sendMail } from './jobs/send-mail-job'
import { env } from '@/env'
import { errorHandler } from '@/error-handler'
import { MessagesRepository } from '@/respositories/messages-repository'
import { MongoMessagesRepository } from '@/respositories/mongo/mongo-messages-repository'
import { JobsRepository } from '@/respositories/jobs-repository'
import { MongoJobsRepository } from '@/respositories/mongo/mongo-jobs-repository'

interface AddJobProps {
  queue: string
  date: Date
  data: any
}

export class Queues {
  private _queues: Agenda
  private MessagesRepository: MessagesRepository
  private JobsRepository: JobsRepository

  constructor() {
    this.MessagesRepository = new MongoMessagesRepository()
    this.JobsRepository = new MongoJobsRepository()
    this._queues = new Agenda({
      db: { address: env.MONGO_DATABASE_URL },
      maxConcurrency: 5,
    })

    this._queues.on('ready', () => {
      console.log('✅ Queues starded.')
    })

    this._queues.define('send-message', async (job: Job) => {
      await sendMessage(job.attrs.data as Message, job.attrs._id.toString())
    })

    this._queues.define('send-mail', async (job: Job) => {
      await sendMail(job.attrs.data as SendMailProps)
    })

    this._queues.start()

    this._queues.on('success:send-message', (job: Job) => {
      this.completeJob(job)
    })

    this._queues.on('fail', async (err: any, job: Job) => {
      await this.jobErrorHandler(err, job)
    })
  }

  async add({ date, data, queue }: AddJobProps) {
    return await this._queues.schedule(date, queue, data)
  }

  private async completeJob(job: Job) {
    if (job.attrs.name === 'send-message') {
      const { clientId, senderName, to, content, apiToken } = job.attrs
        .data as Message
      await this.MessagesRepository.create({
        clientId,
        apiToken,
        senderName,
        to,
        content,
        sendedOn: new Date(),
      })
    }

    await this.JobsRepository.delete(job.attrs._id.toString())
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
}

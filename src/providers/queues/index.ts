import { Message } from '@/DTOS/message-types'
import { env } from '@/env'
import Agenda, { Job } from 'agenda'
import { sendMessage } from './jobs/send-message-job'

interface SendMessageProps {
  date: Date
  message: Message
}

export class Queues {
  private agenda: Agenda

  constructor() {
    this.agenda = new Agenda({ db: { address: env.MONGO_DATABASE_URL } })

    this.agenda.define('send-message', async (job: Job) => {
      await sendMessage(job.attrs.data as Message)
    })

    this.agenda.start()
    this.agenda.on('ready', () => {
      console.log('✅ Queues starded.')
    })
  }

  public sendMessage({ date, message }: SendMessageProps) {
    this.agenda.schedule(date, 'send-message', message)
  }
}

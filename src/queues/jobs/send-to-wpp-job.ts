import { Message } from '@/DTOS/message-types'
import { sendToWppConnect } from '@/use-cases/messages/wpp-server-send'
import { Job } from 'bull'

export default {
  key: 'SendToWPP',
  async handle({ data }: Job<Message>) {
    await sendToWppConnect(data)
  },
}

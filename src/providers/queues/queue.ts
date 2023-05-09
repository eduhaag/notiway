import Queue, { Job } from 'bull'

import * as jobs from './jobs'
import jobsBullConfig from '@/config/jobsBullConfig'
import { Message } from '@/mongo/mongose'
import { redis } from '@/config/redis-config'

const queues = Object.values(jobs).map((job) => ({
  bull: new Queue(job.key, redis),
  name: job.key,
  handle: job.handle,
}))

export default {
  queues,

  add: (name: string, data: any) => {
    const queue = queues.find((q) => q.name === name)

    if (queue) {
      return queue.bull.add(data, jobsBullConfig)
    }
  },

  process: () => {
    console.log('✅ Queues started')
    queues.forEach((queue) => {
      queue.bull.process(queue.handle)

      queue.bull.on('completed', async (job: Job, err) => {
        if (job.queue.name === 'SendToWPP') {
          const { clientId, senderName, to, content } = job.data

          const message = new Message({
            client_id: clientId,
            sender_name: senderName,
            to,
            content,
            sended_at: new Date(),
          })

          await message.save()
        }
      })
    })
  },
}

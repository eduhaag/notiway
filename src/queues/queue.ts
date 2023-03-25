import Queue from 'bull'

import * as jobs from './jobs'
import redisConfig from '@/config/redisConfig'
import jobsBullConfig from '@/config/jobsBullConfig'

const queues = Object.values(jobs).map((job) => ({
  bull: new Queue(job.key, { redis: redisConfig }),
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
    queues.forEach((queue) => {
      queue.bull.process(queue.handle)
      queue.bull.on('failed', (job, err) => {})
    })
  },
}

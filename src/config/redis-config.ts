import { env } from '@/env'
import IoRedisMock from 'ioredis-mock'

interface CreateClient {
  createClient: () => any
}

interface RedisData {
  redis: {
    port: number
    host: string
    password?: string
  }
}

let redis: RedisData | CreateClient

if (env.NODE_ENV === 'test') {
  const redisMock = new IoRedisMock()

  redis = {
    createClient: () => redisMock,
  }
} else {
  redis = {
    redis: {
      port: env.REDIS_PORT,
      host: env.REDIS_HOST,
      password: env.REDIS_PASSWORD,
    },
  }
}

export { redis }

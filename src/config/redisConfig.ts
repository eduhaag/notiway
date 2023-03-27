import { env } from '@/env'
import { RedisMemoryServer } from 'redis-memory-server'

let redisServer
let port
let host

if (env.NODE_ENV === 'test') {
  redisServer = new RedisMemoryServer()
  redisServer.getPort().then((data) => {
    port = data
  })

  redisServer.getHost().then((data) => {
    host = data
  })
} else {
  port = env.REDIS_PORT
  host = env.REDIS_HOST
}

export default {
  host,
  port,
}

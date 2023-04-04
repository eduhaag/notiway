import { env } from '@/env'

// let redisServer
const port = env.REDIS_PORT
const host = env.REDIS_HOST
const password = env.REDIS_PASSWORD ?? undefined

// if (env.NODE_ENV === 'test') {
//   redisServer = new RedisMemoryServer()
//   redisServer.getPort().then((data) => {
//     port = data
//   })

//   redisServer.getHost().then((data) => {
//     host = data
//   })
// } else {
//   port = env.REDIS_PORT
//   host = env.REDIS_HOST
// }

export default {
  host,
  port,
  password,
}

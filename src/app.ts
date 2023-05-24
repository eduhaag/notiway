import fastify from 'fastify'

import { sendersLogOnSocket } from './sockets'

import { fastiFyRegister } from './fastify-register'
import { QueuesProvider } from './providers/queues-provider'
import { errorHandler } from './error-handler'

const MAX_BODY_SIZE = 16 * 1024 * 1024 // 16MB

export const app = fastify({ bodyLimit: MAX_BODY_SIZE })

fastiFyRegister(app)

sendersLogOnSocket()

export const queuesProvider = new QueuesProvider()

app.setErrorHandler((error, _, reply) => {
  errorHandler(error, reply)
})

import fastify from 'fastify'
import * as Sentry from '@sentry/node'

import { ZodError } from 'zod'

import { env } from './env'

import { sendersLogOnSocket } from './sockets'
import queue from './providers/queues/queue'
import { connectToMongoDB } from './mongo/mongose'
import { fastiFyRegister } from './fastify-register'

const MAX_BODY_SIZE = 16 * 1024 * 1024 // 16MB

export const app = fastify({ bodyLimit: MAX_BODY_SIZE })

fastiFyRegister(app)

connectToMongoDB()

queue.process()

sendersLogOnSocket()

Sentry.init({
  dsn: env.SENTRY_DNS,
})

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    Sentry.captureException(error)
  }

  return reply.status(500).send({ message: 'Internal server error' })
})

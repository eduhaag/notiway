import fastify from 'fastify'
import * as Sentry from '@sentry/node'

import { ZodError } from 'zod'

import { env } from './env'

import { sendersLogOnSocket } from './sockets'
import { connectToMongoDB } from './mongo/mongose'
import { fastiFyRegister } from './fastify-register'
import { Queues } from './providers/queues'

const MAX_BODY_SIZE = 16 * 1024 * 1024 // 16MB

export const app = fastify({ bodyLimit: MAX_BODY_SIZE })

fastiFyRegister(app)

connectToMongoDB()

sendersLogOnSocket()

Sentry.init({
  dsn: env.SENTRY_DNS,
})

export const queue = new Queues()

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() })
  }

  if (env.NODE_ENV === 'production') {
    Sentry.captureException(error)
  } else {
    console.error(error)
  }

  return reply.status(500).send({ message: 'Internal server error' })
})

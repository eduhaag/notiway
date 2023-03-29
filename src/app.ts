import fastify from 'fastify'

import { ZodError } from 'zod'

import { env } from './env'

import { sendersLogOnSocket } from './sockets'
import queue from './queues/queue'
import { connectToMongoDB } from './mongo/mongose'
import { fastiFyRegister } from './fastify-register'

export const app = fastify()

fastiFyRegister(app)

connectToMongoDB()

queue.process()

sendersLogOnSocket()

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // todo usar registro no sentry
  }

  return reply.status(500).send({ message: 'Internal server error' })
})

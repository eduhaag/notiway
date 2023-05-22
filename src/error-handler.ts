import * as Sentry from '@sentry/node'

import { FastifyReply } from 'fastify'
import { ZodError } from 'zod'
import { env } from './env'

export function errorHandler(error: Error, reply?: FastifyReply) {
  if (error instanceof ZodError && reply) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() })
  }

  if (env.NODE_ENV === 'production') {
    Sentry.init({
      dsn: env.SENTRY_DNS,
    })
    Sentry.captureException(error)
  } else {
    console.error(error)
  }

  return reply && reply.status(500).send({ message: 'Internal server error' })
}

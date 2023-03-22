import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'
import { ZodError } from 'zod'

import { env } from './env'
import { usersRoutes } from './http/controllers/users/routes'
import { adminRoutes } from './http/controllers/adminRoutes'
import { consumersRoutes } from './http/controllers/consumers/routes'
import { clientsRoutes } from './http/controllers/clients/routes'
import { sendersRoutes } from './http/controllers/senders/routes'
import { sendersLogOnSocket } from './sockets'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: env.NODE_ENV === 'dev' ? '1d' : '10m',
  },
})

app.register(fastifyCookie)

app.register(adminRoutes)
app.register(usersRoutes)
app.register(consumersRoutes)
app.register(clientsRoutes)
app.register(sendersRoutes)

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

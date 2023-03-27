import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'
import { ZodError } from 'zod'
import { createBullBoard } from '@bull-board/api'
import { BullAdapter } from '@bull-board/api/bullAdapter'
import { FastifyAdapter } from '@bull-board/fastify'
import { env } from './env'

import { usersRoutes } from './http/controllers/users/routes'
import { adminRoutes } from './http/controllers/adminRoutes'
import { consumersRoutes } from './http/controllers/consumers/routes'
import { clientsRoutes } from './http/controllers/clients/routes'
import { sendersRoutes } from './http/controllers/senders/routes'
import { messagesRoutes } from './http/controllers/messages/routes'
import { sendersLogOnSocket } from './sockets'
import queue from './queues/queue'
import { connectToMongoDB } from './mongo/mongose'

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

queue.process()
connectToMongoDB()

const fastiFyAdapter = new FastifyAdapter()

createBullBoard({
  queues: queue.queues.map((q) => new BullAdapter(q.bull)),
  serverAdapter: fastiFyAdapter,
})

fastiFyAdapter.setBasePath('/ui')
app.register(fastiFyAdapter.registerPlugin(), { prefix: '/ui' })

app.register(fastifyCookie)

app.register(adminRoutes)
app.register(usersRoutes)
app.register(consumersRoutes)
app.register(clientsRoutes)
app.register(sendersRoutes)
app.register(messagesRoutes, { prefix: '/api' })

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

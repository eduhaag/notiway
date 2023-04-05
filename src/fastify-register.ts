import { FastifyInstance } from 'fastify'
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'
import fastifyStatic from '@fastify/static'
import cors from '@fastify/cors'
import { createBullBoard } from '@bull-board/api'
import { FastifyAdapter } from '@bull-board/fastify'
import { BullAdapter } from '@bull-board/api/bullAdapter'
import path from 'path'

import { env } from './env'
import queue from './queues/queue'

import { adminRoutes } from './http/controllers/adminRoutes'
import { usersRoutes } from './http/controllers/users/routes'
import { consumersRoutes } from './http/controllers/consumers/routes'
import { clientsRoutes } from './http/controllers/clients/routes'
import { sendersRoutes } from './http/controllers/senders/routes'
import { messagesRoutes } from './http/controllers/messages/routes'
import { readFileSync } from 'fs'

export async function fastiFyRegister(app: FastifyInstance) {
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

  app.register(cors, {})

  app.register(fastifyCookie)

  app.register(fastifyStatic, {
    root: path.join(__dirname, 'public'),
    prefix: '/public',
  })

  // routes
  app.register(adminRoutes, { prefix: 'admin' })
  app.register(usersRoutes, { prefix: 'site' })
  app.register(consumersRoutes, { prefix: 'site' })
  app.register(clientsRoutes, { prefix: 'site' })
  app.register(sendersRoutes, { prefix: 'site' })
  app.register(messagesRoutes, { prefix: 'v1' })

  const docs = readFileSync(
    path.resolve(__dirname, 'documentation', 'docs.html'),
  )

  const terms = readFileSync(
    path.resolve(__dirname, 'documentation', 'terms.html'),
  )

  app.get('/', (req, reply) => {
    return reply.type('text/html').send(docs)
  })

  app.get('/terms', (req, reply) => {
    return reply.type('text/html').send(terms)
  })

  // Bull Board
  const fastiFyAdapter = new FastifyAdapter()
  createBullBoard({
    queues: queue.queues.map((q) => new BullAdapter(q.bull)),
    serverAdapter: fastiFyAdapter,
  })
  fastiFyAdapter.setBasePath('/queues/ui')
  app.register(fastiFyAdapter.registerPlugin(), {
    prefix: 'queues/ui',
    basePath: '',
  })
}

import fastifyJwt from '@fastify/jwt'
import { FastifyInstance } from 'fastify'
import fastifyCookie from '@fastify/cookie'
import { createBullBoard } from '@bull-board/api'
import { FastifyAdapter } from '@bull-board/fastify'
import { BullAdapter } from '@bull-board/api/bullAdapter'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'

import { env } from './env'
import queue from './queues/queue'

import { adminRoutes } from './http/controllers/adminRoutes'
import { usersRoutes } from './http/controllers/users/routes'
import { consumersRoutes } from './http/controllers/consumers/routes'
import { clientsRoutes } from './http/controllers/clients/routes'
import { sendersRoutes } from './http/controllers/senders/routes'
import { messagesRoutes } from './http/controllers/messages/routes'
import path from 'path'
import swaggerUiConfig from './config/swagger-ui-config'

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

  app.register(fastifyCookie)

  console.log(path.resolve())

  app.register(swagger, {
    mode: 'static',
    specification: {
      path: './src/documentation/docs.yaml',
      postProcessor: function (swaggerObject) {
        return swaggerObject
      },
      baseDir: path.resolve(__dirname, 'documentation', 'docs.json'),
    },
  })
  app.register(swaggerUi, swaggerUiConfig)

  // routes
  app.register(adminRoutes, { prefix: 'admin' })
  app.register(usersRoutes, { prefix: 'site' })
  app.register(consumersRoutes, { prefix: 'site' })
  app.register(clientsRoutes, { prefix: 'site' })
  app.register(sendersRoutes, { prefix: 'site' })
  app.register(messagesRoutes, { prefix: 'v1/messages' })

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

  await app.ready()
  app.swagger()
}

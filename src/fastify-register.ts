import { FastifyInstance } from 'fastify'
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'
import fastifyStatic from '@fastify/static'
import FastifySocket from 'fastify-socket.io'
import cors from '@fastify/cors'
import path from 'path'

import { env } from './env'

import { adminRoutes } from './http/controllers/adminRoutes'
import { usersRoutes } from './http/controllers/users/routes'
import { consumersRoutes } from './http/controllers/consumers/routes'
import { clientsRoutes } from './http/controllers/clients/routes'
import { sendersRoutes } from './http/controllers/senders/routes'
import { messagesRoutes } from './http/controllers/messages/routes'
import { webHookController } from './http/controllers/webHook'

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

  app.register(cors, { origin: true, credentials: true })

  app.register(FastifySocket, { cors: { origin: true } })

  app.register(fastifyCookie)

  app.register(fastifyStatic, {
    root: path.join(__dirname, 'public'),
    prefix: '/',
  })

  // routes
  app.register(adminRoutes, { prefix: 'admin' })
  app.register(usersRoutes, { prefix: 'site' })
  app.register(consumersRoutes, { prefix: 'site' })
  app.register(clientsRoutes, { prefix: 'site' })
  app.register(sendersRoutes, { prefix: 'site' })
  app.register(messagesRoutes, { prefix: 'v1' })

  // Listen wppConnect
  app.post('/webhook', webHookController)
}

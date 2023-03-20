import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { create } from './create'
import { remove } from './remove'
import { fetch } from './fetch'
import { generateToken } from './generate-token'

export async function clientsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.post('/clients', create)

  app.patch('/clients/:clientId/generate-token', generateToken)

  app.get('/consumers/:consumerId/clients', fetch)

  app.delete('/clients/:clientId', remove)
}

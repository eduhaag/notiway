import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { create } from './create'
import { remove } from './remove'

export async function clientsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.post('/clients', create)

  app.delete('/clients/:clientId', remove)
}

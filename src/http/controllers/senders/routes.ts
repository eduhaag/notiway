import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { create } from './create'
import { fetchByConsumerId } from './fetch-by-consumer-id'

export async function sendersRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.post('/senders', create)
  app.get('/consumers/:consumerId/senders', fetchByConsumerId)
}

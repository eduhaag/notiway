import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { profile } from './profile'
import { create } from './create'

export async function consumersRoutes(app: FastifyInstance) {
  app.post('/consumers', create)

  // Authenticate
  app.put('/consumers/:consumerId', { onRequest: [verifyJWT] }, profile)
  app.get('/consumers/:consumerId', { onRequest: [verifyJWT] }, profile)
}

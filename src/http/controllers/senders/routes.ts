import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { create } from './create'
import { fetchByConsumerId } from './fetch-by-consumer-id'
import { getSendeQrCode } from './get-qr-code'
import { getSender } from './get-sender'
import { disconnectSender } from './disconnect'

export async function sendersRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.post('/senders', create)
  app.post('/senders/:senderId/connect', getSendeQrCode)
  app.patch('/senders/:senderId/disconnect', disconnectSender)
  app.get('/consumers/:consumerId/senders', fetchByConsumerId)
  app.get('/senders/:senderId', getSender)
}

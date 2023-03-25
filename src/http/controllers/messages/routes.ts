import { FastifyInstance } from 'fastify'
import { sendText } from './send-text'
import { extractToken } from '@/http/middlewares/extract-token'

export async function messagesRoutes(app: FastifyInstance) {
  app.addHook('onRequest', extractToken)

  app.post('/send-text', sendText)
}

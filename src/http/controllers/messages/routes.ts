import { FastifyInstance } from 'fastify'
import { sendText } from './send-text'
import { extractToken } from '@/http/middlewares/extract-token'

import { sendFile } from './send-file'

export async function messagesRoutes(app: FastifyInstance) {
  app.addHook('onRequest', extractToken)

  app.post('/send-text', sendText)

  app.post('/send-image', (req, res) => {
    sendFile(req, res, 'IMAGE')
  })

  app.post('/send-file', (req, res) => {
    sendFile(req, res, 'FILE')
  })

  app.post('/send-audio', (req, res) => {
    sendFile(req, res, 'AUDIO')
  })
}

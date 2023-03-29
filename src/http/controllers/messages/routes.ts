import { FastifyInstance } from 'fastify'
import { sendText } from './send-text'
import { extractToken } from '@/http/middlewares/extract-token'

import { sendFile } from './send-file'
import { sendLink } from './send-link'
import { sendLocation } from './send-location'
import { sendContact } from './send-contact'
import { sendGif } from './send-gif'
import { sendSticker } from './send-sticker'

export async function messagesRoutes(app: FastifyInstance) {
  app.addHook('onRequest', extractToken)

  app.post('/send-text', sendText)
  app.post('/send-link', sendLink)
  app.post('/send-location', sendLocation)
  app.post('/send-contact', sendContact)
  app.post('/send-gif', sendGif)
  app.post('/send-sticker', sendSticker)

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

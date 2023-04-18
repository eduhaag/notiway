import { app } from '@/app'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function webHookController(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const { event, session, status } = req.body as any
  if (event === 'status-find') {
    app.io.emit(`sender-status:${session}`, { status })

    if (status === 'inChat') {
      app.io.off(`sender-qrcode:${session}`, () => {})
    }
  }

  return reply.send()
}

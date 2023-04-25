import { app } from '@/app'
import { prisma } from '@/lib/prisma'
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
      app.io.off(`sender-status:${session}`, () => {})
    }

    if (status === 'browserClose') {
      await prisma.sender.update({
        where: { name: session },
        data: { paread_at: null },
      })
    }
  }

  return reply.send()
}

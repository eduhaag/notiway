import { ClientNotAuthorizedError } from '@/use-cases/errors/client-not-authorized-error'
import { ClientNotReadyError } from '@/use-cases/errors/client-not-ready-error'
import { ClientSenderNotReadyError } from '@/use-cases/errors/client-sender-not-ready-error'
import { makeSendTextUseCase } from '@/use-cases/messages/factories/make-send-text-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function sendText(req: FastifyRequest, reply: FastifyReply) {
  const sendTextBodySchema = z.object({
    to: z.string(),
    message: z.string(),
    send_on: z.coerce.date().optional(),
  })

  const { message, to, send_on } = sendTextBodySchema.parse(req.body)

  try {
    const sendTexUseCase = makeSendTextUseCase()

    await sendTexUseCase.execute({
      text: message,
      to,
      token: req.token,
      sendOn: send_on,
    })

    return reply.status(200).send({ status: 'sended' })
  } catch (error) {
    if (error instanceof ClientNotAuthorizedError) {
      return reply.status(401).send({ message: error.message })
    }

    if (error instanceof ClientNotReadyError) {
      return reply.status(425).send({ message: error.message })
    }

    if (error instanceof ClientSenderNotReadyError) {
      return reply.status(425).send({ message: error.message })
    }

    throw error
  }
}

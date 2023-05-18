import { ClientNotAuthorizedError } from '@/use-cases/errors/client-not-authorized-error'
import { ClientNotReadyError } from '@/use-cases/errors/client-not-ready-error'
import { ClientSenderNotReadyError } from '@/use-cases/errors/client-sender-not-ready-error'
import { makeSendLinkUseCase } from '@/use-cases/messages/factories/make-send-link-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function sendLink(req: FastifyRequest, reply: FastifyReply) {
  const sendLinkBodySchema = z.object({
    to: z.string(),
    url: z.string(),
    message: z.string().optional(),
    send_on: z.coerce.date().optional(),
  })

  const { message, to, url, send_on } = sendLinkBodySchema.parse(req.body)

  try {
    const sendLinkUseCase = makeSendLinkUseCase()

    await sendLinkUseCase.execute({
      to,
      url,
      caption: message,
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

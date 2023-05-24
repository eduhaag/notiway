import { ClientNotAuthorizedError } from '@/use-cases/errors/client-not-authorized-error'
import { ClientNotReadyError } from '@/use-cases/errors/client-not-ready-error'
import { ClientSenderNotReadyError } from '@/use-cases/errors/client-sender-not-ready-error'
import { makeSendGifUseCase } from '@/use-cases/messages/factories/make-send-gif-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function sendGif(req: FastifyRequest, reply: FastifyReply) {
  const sendGifBodySchema = z.object({
    to: z.string(),
    url: z.string(),
    send_on: z.string().optional(),
  })

  const { to, url, send_on } = sendGifBodySchema.parse(req.body)

  try {
    const sendGifUseCase = makeSendGifUseCase()

    const response = await sendGifUseCase.execute({
      to,
      token: req.token,
      url,
      sendOn: send_on,
    })

    return reply.status(200).send(response)
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

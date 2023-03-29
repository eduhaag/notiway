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
  })

  const { to, url } = sendGifBodySchema.parse(req.body)

  try {
    const sendGifUseCase = makeSendGifUseCase()

    await sendGifUseCase.execute({
      to,
      token: req.token,
      url,
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
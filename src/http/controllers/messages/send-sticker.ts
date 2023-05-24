import { ClientNotAuthorizedError } from '@/use-cases/errors/client-not-authorized-error'
import { ClientNotReadyError } from '@/use-cases/errors/client-not-ready-error'
import { ClientSenderNotReadyError } from '@/use-cases/errors/client-sender-not-ready-error'
import { makeSendStickerUseCase } from '@/use-cases/messages/factories/make-send-sticker-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function sendSticker(req: FastifyRequest, reply: FastifyReply) {
  const sendStickerBodySchema = z.object({
    to: z.string(),
    url: z.string(),
    send_on: z.coerce.date().optional(),
  })

  const { to, url, send_on } = sendStickerBodySchema.parse(req.body)

  try {
    const sendSticker = makeSendStickerUseCase()

    await sendSticker.execute({
      to,
      token: req.token,
      url,
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

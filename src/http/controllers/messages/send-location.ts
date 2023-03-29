import { ClientNotAuthorizedError } from '@/use-cases/errors/client-not-authorized-error'
import { ClientNotReadyError } from '@/use-cases/errors/client-not-ready-error'
import { ClientSenderNotReadyError } from '@/use-cases/errors/client-sender-not-ready-error'
import { makeSendLocationUseCase } from '@/use-cases/messages/factories/make-send-location-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function sendLocation(req: FastifyRequest, reply: FastifyReply) {
  const sendLocationBodySchema = z.object({
    to: z.string(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    title: z.string().optional(),
    address: z.string().optional(),
  })

  const { to, latitude, longitude, address, title } =
    sendLocationBodySchema.parse(req.body)

  try {
    const sendLocationUseCase = makeSendLocationUseCase()

    await sendLocationUseCase.execute({
      to,
      token: req.token,
      latitude,
      longitude,
      title,
      address,
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

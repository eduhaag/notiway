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
    send_on: z.string().optional(),
  })

  const { to, latitude, longitude, address, title, send_on } =
    sendLocationBodySchema.parse(req.body)

  try {
    const sendLocationUseCase = makeSendLocationUseCase()

    const response = await sendLocationUseCase.execute({
      to,
      token: req.token,
      latitude,
      longitude,
      title,
      address,
      sendOn: send_on,
    })

    return reply.status(200).send(response)
  } catch (error) {
    if (error instanceof ClientNotAuthorizedError) {
      return reply.status(401).send({ ok: false, message: error.message })
    }

    if (error instanceof ClientNotReadyError) {
      return reply.status(425).send({ ok: false, message: error.message })
    }

    if (error instanceof ClientSenderNotReadyError) {
      return reply.status(425).send({ ok: false, message: error.message })
    }

    throw error
  }
}

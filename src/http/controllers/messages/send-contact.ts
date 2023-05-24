import { ClientNotAuthorizedError } from '@/use-cases/errors/client-not-authorized-error'
import { ClientNotReadyError } from '@/use-cases/errors/client-not-ready-error'
import { ClientSenderNotReadyError } from '@/use-cases/errors/client-sender-not-ready-error'
import { makeSendContactUseCase } from '@/use-cases/messages/factories/make-send-contact-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function sendContact(req: FastifyRequest, reply: FastifyReply) {
  const sendContactBodySchema = z.object({
    to: z.string(),
    name: z.string(),
    contact: z.string(),
    send_on: z.string().optional(),
  })

  const { to, contact, name, send_on } = sendContactBodySchema.parse(req.body)

  try {
    const sendContactUseCase = makeSendContactUseCase()

    const response = await sendContactUseCase.execute({
      to,
      token: req.token,
      contact,
      name,
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

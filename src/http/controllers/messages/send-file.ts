import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { ClientNotAuthorizedError } from '@/use-cases/errors/client-not-authorized-error'
import { ClientNotReadyError } from '@/use-cases/errors/client-not-ready-error'
import { ClientSenderNotReadyError } from '@/use-cases/errors/client-sender-not-ready-error'
import { makeSendFileUseCase } from '@/use-cases/messages/factories/make-send-file-use-case'

export async function sendFile(
  req: FastifyRequest,
  reply: FastifyReply,
  type: 'AUDIO' | 'IMAGE' | 'FILE',
) {
  const sendTextBodySchema = z.object({
    to: z.string(),
    base64: z.string(),
    message: z.string().optional(),
    filename: z.string().optional(),
    send_on: z.string().optional(),
  })

  const { message, to, base64, filename, send_on } = sendTextBodySchema.parse(
    req.body,
  )

  if (type === 'FILE' && !filename) {
    return reply.status(400).send({ message: 'Filename is required' })
  }

  try {
    const SendFileUseCase = makeSendFileUseCase()

    const response = await SendFileUseCase.execute({
      base64,
      to,
      text: message,
      token: req.token,
      fileType: type,
      fileName: filename,
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

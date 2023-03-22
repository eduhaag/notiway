import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'
import { SenderDisablerError } from '@/use-cases/errors/sender-disabled-error'
import { makeGetSenderQrCodeUseCase } from '@/use-cases/senders/factories/make-get-sender-qr-code-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getSendeQrCode(req: FastifyRequest, reply: FastifyReply) {
  const getQrCodeParamsSchema = z.object({
    senderId: z.string().uuid(),
  })

  const { senderId } = getQrCodeParamsSchema.parse(req.params)

  try {
    const GetQrCodeUseCase = makeGetSenderQrCodeUseCase()

    const response = await GetQrCodeUseCase.execute({ senderId })

    return reply.status(200).send(response)
  } catch (error) {
    if (error instanceof SenderDisablerError) {
      return reply.status(400).send({ message: error.message })
    }

    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}

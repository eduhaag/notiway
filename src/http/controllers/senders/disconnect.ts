import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'
import { makeDisconnectSenderUseCase } from '@/use-cases/senders/factories/make-disconnect-sender-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function disconnectSender(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const disconnectSenderParamsSchema = z.object({
    senderId: z.string().uuid(),
  })

  const { senderId } = disconnectSenderParamsSchema.parse(req.params)

  try {
    const disconnectUseCase = makeDisconnectSenderUseCase()

    await disconnectUseCase.execute({ senderId })

    return reply.status(200).send({ message: 'Sender disconnected' })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}

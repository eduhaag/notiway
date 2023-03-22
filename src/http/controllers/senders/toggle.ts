import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'
import { makeToggleSenderUseCase } from '@/use-cases/senders/factories/make-toggle-sender-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function toggle(req: FastifyRequest, reply: FastifyReply) {
  const toggleSenderBodySchema = z.object({
    isEnabled: z.boolean(),
  })
  const toggleSenderParamsSchema = z.object({
    senderId: z.string().uuid(),
  })

  const { isEnabled } = toggleSenderBodySchema.parse(req.body)
  const { senderId } = toggleSenderParamsSchema.parse(req.params)

  try {
    const toggleSenderUseCase = makeToggleSenderUseCase()

    await toggleSenderUseCase.execute({ isEnabled, senderId })

    return reply.status(204).send()
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}

import { makeGetSenderUseCase } from '@/use-cases/senders/factories/make-get-sender-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getSender(req: FastifyRequest, reply: FastifyReply) {
  const getSenderParamsSchema = z.object({
    senderId: z.string().uuid(),
  })

  const { senderId } = getSenderParamsSchema.parse(req.params)

  try {
    const GetSenderUseCase = makeGetSenderUseCase()

    const response = await GetSenderUseCase.execute({ senderId })

    return reply.status(200).send(response)
  } catch (error) {
    throw error
  }
}

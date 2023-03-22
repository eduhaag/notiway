import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'
import { makeUpdateSenderUseCase } from '@/use-cases/senders/factories/make-update-sender-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function updateSender(req: FastifyRequest, reply: FastifyReply) {
  const updateSenderBodySchema = z.object({
    type: z.enum(['SHARED', 'EXCLUSIVE', 'PRIVATE']).optional(),
    consumer_id: z.string().optional(),
    company: z.string().optional(),
    nationalCode: z.number().optional(),
    internacionalCode: z.number().optional(),
    region: z.string().optional(),
    lastRecharge: z.coerce.date().optional(),
  })
  const updateSenderParamsSchema = z.object({
    senderId: z.string().uuid(),
  })

  const data = updateSenderBodySchema.parse(req.body)

  const { senderId } = updateSenderParamsSchema.parse(req.params)

  try {
    const updateSenderUseCase = makeUpdateSenderUseCase()

    await updateSenderUseCase.execute({
      id: senderId,
      company: data.company,
      consumer_id: data.consumer_id,
      internacional_code: data.internacionalCode,
      last_recharge: data.lastRecharge,
      national_code: data.nationalCode,
      region: data.region,
      type: data.type,
    })

    return reply.status(204).send()
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}

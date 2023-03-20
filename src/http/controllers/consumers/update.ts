import { makeConsumerUpdateUseCase } from '@/use-cases/consumers/factories/make-consumer-update-use-case'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function update(req: FastifyRequest, reply: FastifyReply) {
  const updateConsumerBodySchema = z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    fone: z.string().optional(),
    whatsapp: z.string().optional(),
    zip_code: z.string().optional(),
    street: z.string().optional(),
    number: z.string().optional(),
    complement: z.string().optional(),
    district: z.string().optional(),
    city: z.string().optional(),
    province: z.string().optional(),
    country: z.string().optional(),
    acceptMarketing: z.boolean().optional(),
  })
  const updateConsumerParamsSchema = z.object({
    consumerId: z.string(),
  })

  const data = updateConsumerBodySchema.parse(req.body)
  const { consumerId } = updateConsumerParamsSchema.parse(req.params)

  try {
    const updateConsumerUseCase = makeConsumerUpdateUseCase()

    await updateConsumerUseCase.execute({ id: consumerId, ...data })

    return reply.status(204).send()
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}

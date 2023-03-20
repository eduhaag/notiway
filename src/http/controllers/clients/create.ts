import { makeCreateClientUseCase } from '@/use-cases/clients/factories/make-create-client-use-case'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function create(req: FastifyRequest, reply: FastifyReply) {
  const createClientBodySchema = z.object({
    name: z.string(),
    header: z.string().optional(),
    footer: z.string().optional(),
    consumer_id: z.string().uuid(),
  })

  const data = createClientBodySchema.parse(req.body)

  try {
    const createClientUseCase = makeCreateClientUseCase()

    await createClientUseCase.execute(data)

    return reply.status(201).send()
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}

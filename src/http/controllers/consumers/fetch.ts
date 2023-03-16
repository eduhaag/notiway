import { makeFetchConsumersUseCase } from '@/use-cases/consumers/factories/make-fetch-consumers-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function fetch(req: FastifyRequest, reply: FastifyReply) {
  const fetchQuerySchema = z.object({
    taxId: z.string().optional(),
    name: z.string().optional(),
    email: z.string().optional(),
    acceptMarketing: z.coerce.boolean().optional(),
  })

  const { acceptMarketing, email, name, taxId } = fetchQuerySchema.parse(
    req.query,
  )

  const fetchUseCase = makeFetchConsumersUseCase()

  const { consumers } = await fetchUseCase.execute({
    acceptMarketing,
    email,
    name,
    taxId,
  })

  return reply.status(200).send({ consumers })
}

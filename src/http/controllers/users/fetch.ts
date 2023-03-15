import { makeFetchUsersUseCase } from '@/use-cases/users/factories/make-fetch-users-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function fetch(req: FastifyRequest, reply: FastifyReply) {
  const createQuerySchema = z.object({
    accessLevel: z.coerce.number().optional(),
  })

  const { accessLevel } = createQuerySchema.parse(req.query)

  const fetchUseCase = makeFetchUsersUseCase()

  const { users } = await fetchUseCase.execute({ accessLevel })

  return reply.status(200).send({ users })
}

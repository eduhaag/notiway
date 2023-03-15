import { EmailAlreadyUsedError } from '@/use-cases/errors/email-already-used-error'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'
import { makeUpdateUserUseCase } from '@/use-cases/users/factories/make-update-user-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function update(req: FastifyRequest, reply: FastifyReply) {
  const updateBodySchema = z.object({
    email: z.string().email().optional(),
    accessLevel: z.number().optional(),
  })
  const updateParamsSchema = z.object({
    userId: z.string(),
  })

  const { email, accessLevel } = updateBodySchema.parse(req.body)
  const { userId } = updateParamsSchema.parse(req.params)

  try {
    const updateUseCase = makeUpdateUserUseCase()

    await updateUseCase.execute({ userId, email, accessLevel })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }
    if (error instanceof EmailAlreadyUsedError) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }

  return reply.status(204).send()
}

import { EmailAlreadyUsedError } from '@/use-cases/errors/email-already-used-error'
import { makeCreateUserUseCase } from '@/use-cases/users/factories/make-create-user-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function create(req: FastifyRequest, reply: FastifyReply) {
  const createBodySchema = z.object({
    email: z.string().email(),
    password: z.string(),
    accessLevel: z.number().optional(),
  })

  const { email, password, accessLevel } = createBodySchema.parse(req.body)

  try {
    const createUserUseCase = makeCreateUserUseCase()

    await createUserUseCase.execute({ email, password, accessLevel })
  } catch (error) {
    if (error instanceof EmailAlreadyUsedError) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }

  return reply.status(201).send()
}

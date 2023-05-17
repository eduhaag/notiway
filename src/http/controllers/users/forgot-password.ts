import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'
import { makeForgotPasswordUseCase } from '@/use-cases/users/factories/make-forgot-password-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function forgotPassword(req: FastifyRequest, reply: FastifyReply) {
  const forgotPasswordBodySchema = z.object({
    email: z.string().email(),
  })

  const { email } = forgotPasswordBodySchema.parse(req.body)

  try {
    const forgotPasswordUseCase = makeForgotPasswordUseCase()
    await forgotPasswordUseCase.execute({ email })

    return reply.status(204).send()
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}

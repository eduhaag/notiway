import { InvalidTokenError } from '@/use-cases/errors/invalid-token-error'
import { makeResetPasswordUseCase } from '@/use-cases/users/factories/make-reset-password-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function resetPassword(req: FastifyRequest, reply: FastifyReply) {
  const resetPasswordBodySchema = z.object({
    newPassword: z.string(),
    token: z.string(),
  })

  const { newPassword, token } = resetPasswordBodySchema.parse(req.body)

  try {
    const resetPasswordUseCase = makeResetPasswordUseCase()
    await resetPasswordUseCase.execute({ newPassword, token })

    return reply.status(204).send()
  } catch (error) {
    if (error instanceof InvalidTokenError) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }
}

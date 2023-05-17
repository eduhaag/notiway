import { EmailAlreadyValidatedError } from '@/use-cases/errors/email-already-valitadet-error'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'
import { makeResendVerificationUseCase } from '@/use-cases/users/factories/make-resend-verification-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function resendVerification(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const resendVerificationBodySchema = z.object({
    email: z.string().email(),
  })

  const { email } = resendVerificationBodySchema.parse(req.body)

  try {
    const resendVerificationUseCase = makeResendVerificationUseCase()
    await resendVerificationUseCase.execute({ email })

    return reply.status(204).send()
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }
    if (error instanceof EmailAlreadyValidatedError) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }
}

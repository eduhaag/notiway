import { InvalidTokenError } from '@/use-cases/errors/invalid-token-error'
import { makeMailVerifyUseCase } from '@/use-cases/users/factories/make-mail-verify-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function mailVerify(req: FastifyRequest, reply: FastifyReply) {
  const mailVerifyQuerySchema = z.object({
    token: z.string(),
  })

  const { token } = mailVerifyQuerySchema.parse(req.query)

  try {
    const mailVerifyUseCase = makeMailVerifyUseCase()
    await mailVerifyUseCase.execute({ token })

    return reply.status(204).send()
  } catch (error) {
    if (error instanceof InvalidTokenError) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }
}

import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'
import { WrongOldPasswordError } from '@/use-cases/errors/wrong-old-password-error'
import { makeChangePasswordUseCase } from '@/use-cases/users/factories/make-change-password-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function changePassword(req: FastifyRequest, reply: FastifyReply) {
  const changePasswordBodySchema = z.object({
    oldPassword: z.string(),
    newPassword: z.string(),
  })

  const { newPassword, oldPassword } = changePasswordBodySchema.parse(req.body)

  try {
    const changePasswordUseCase = makeChangePasswordUseCase()

    await changePasswordUseCase.execute({
      userId: req.user.sub,
      oldPassword,
      newPassword,
    })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }
    if (error instanceof WrongOldPasswordError) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }

  return reply.status(204).send()
}

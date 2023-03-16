import { makeProfileUseCase } from '@/use-cases/consumers/factories/make-profile-use-case'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function profile(req: FastifyRequest, reply: FastifyReply) {
  const profileParamsSchema = z.object({
    consumerId: z.string(),
  })

  const { consumerId } = profileParamsSchema.parse(req.params)

  try {
    const profileUseCase = makeProfileUseCase()

    const { consumer } = await profileUseCase.execute({ consumerId })

    return reply.status(200).send({ consumer })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}

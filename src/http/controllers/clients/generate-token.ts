import { makeGenerateClientTokenUseCase } from '@/use-cases/clients/factories/make-generate-token-use-case'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function generateToken(req: FastifyRequest, reply: FastifyReply) {
  const generateTokenParamsSchema = z.object({
    clientId: z.string().uuid(),
  })

  const { clientId } = generateTokenParamsSchema.parse(req.params)

  try {
    const generateTokenUseCase = makeGenerateClientTokenUseCase()

    const token = await generateTokenUseCase.execute({ clientId })

    return reply.status(200).send(token)
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}

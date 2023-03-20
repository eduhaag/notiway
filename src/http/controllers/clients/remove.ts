import { makeDeleteClientUseCase } from '@/use-cases/clients/factories/make-delete-client-use-case'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function remove(req: FastifyRequest, reply: FastifyReply) {
  const removeClientParamsSchema = z.object({
    clientId: z.string().uuid(),
  })

  const { clientId } = removeClientParamsSchema.parse(req.params)

  try {
    const deleteClientUseCase = makeDeleteClientUseCase()

    await deleteClientUseCase.execute({ clientId })

    return reply.status(204).send()
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}

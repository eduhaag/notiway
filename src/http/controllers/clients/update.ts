import { makeUpdateClientUseCase } from '@/use-cases/clients/factories/make-update-client-use-case'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function update(req: FastifyRequest, reply: FastifyReply) {
  const updateClientBodySchema = z.object({
    sender_id: z.string().optional(),
    name: z.string().optional(),
    status: z.string().optional(),
    header: z.string().optional(),
    footer: z.string().optional(),
  })

  const updateClientParamsSchema = z.object({
    clientId: z.string().uuid(),
  })

  const { clientId } = updateClientParamsSchema.parse(req.params)

  const data = updateClientBodySchema.parse(req.body)

  if (data.status && req.user.access_level < 50) {
    data.status = undefined
  }

  try {
    const updateClientUseCase = makeUpdateClientUseCase()

    await updateClientUseCase.execute({ id: clientId, ...data })

    return reply.status(204).send()
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}

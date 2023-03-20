import { makeFetchClientUseCase } from '@/use-cases/clients/factories/make-fetch-clients-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function fetch(req: FastifyRequest, reply: FastifyReply) {
  const fetchClientsParamsSchema = z.object({
    consumerId: z.string().uuid(),
  })
  const { consumerId } = fetchClientsParamsSchema.parse(req.params)

  const fetchClientsUseCase = makeFetchClientUseCase()

  const clients = await fetchClientsUseCase.execute({ consumerId })

  return reply.status(200).send(clients)
}

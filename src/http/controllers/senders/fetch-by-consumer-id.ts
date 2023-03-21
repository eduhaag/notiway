import { makeFetchSendersByConsumerIdUseCase } from '@/use-cases/senders/factories/make-fetch-sende-by-consumer-id-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function fetchByConsumerId(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchSendersParamsSchema = z.object({
    consumerId: z.string().uuid(),
  })
  const { consumerId } = fetchSendersParamsSchema.parse(req.params)

  const fetchByConsumerIdUseCase = makeFetchSendersByConsumerIdUseCase()

  const senders = await fetchByConsumerIdUseCase.execute({ consumerId })

  return reply.status(200).send(senders)
}

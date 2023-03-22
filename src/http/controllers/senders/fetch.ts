import { makeFetchSendersUseCase } from '@/use-cases/senders/factories/make-fetch-senders-use-case'
import dayjs from 'dayjs'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function fetchSenders(req: FastifyRequest, reply: FastifyReply) {
  const fetchSendersQuerySchema = z.object({
    type: z.enum(['SHARED', 'EXCLUSIVE', 'PRIVATE']).optional(),
    enabled: z
      .string()
      .transform((value) => {
        // eslint-disable-next-line eqeqeq
        return value == 'true'
      })
      .optional(),
    nationalCode: z.coerce.number().optional(),
    lastRecharge: z
      .string()
      .transform((val) => {
        const [from, to] = val.split('/')

        const lastPayment = {
          from: dayjs(from).startOf('d').toDate(),
          to: dayjs(to).endOf('d').toDate(),
        }

        return lastPayment
      })
      .optional(),
  })
  const filter = fetchSendersQuerySchema.parse(req.query)

  const fetchClientsUseCase = makeFetchSendersUseCase()

  const senders = await fetchClientsUseCase.execute(filter)

  return reply.status(200).send(senders)
}

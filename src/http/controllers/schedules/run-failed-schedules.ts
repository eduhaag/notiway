import { makeRunFailedSchedulesUseCase } from '@/use-cases/messages/factories/make-run-failed-schedules-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function runFailedSchedules(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const runFailedSchedulesQueryParams = z.object({
    clientId: z.string().optional(),
  })

  const { clientId } = runFailedSchedulesQueryParams.parse(req.query)

  try {
    const runFailJobsUseCase = makeRunFailedSchedulesUseCase()

    await runFailJobsUseCase.execute({
      clientId,
    })

    return reply.status(204).send()
  } catch (error) {
    throw error
  }
}

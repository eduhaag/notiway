import { ClientNotAuthorizedError } from '@/use-cases/errors/client-not-authorized-error'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'
import { makeRunScheduleByIdUseCase } from '@/use-cases/messages/factories/make-run-schedule-by-id-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function runSchedule(req: FastifyRequest, reply: FastifyReply) {
  const runScheduleParamsSchema = z.object({
    scheduleId: z.string(),
  })

  const { scheduleId } = runScheduleParamsSchema.parse(req.params)

  try {
    const runScheduleByIdUseCase = makeRunScheduleByIdUseCase()

    await runScheduleByIdUseCase.execute({
      token: req.token,
      scheduleId,
    })

    return reply.status(204).send()
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    if (error instanceof ClientNotAuthorizedError) {
      return reply.status(401).send({ message: error.message })
    }

    throw error
  }
}

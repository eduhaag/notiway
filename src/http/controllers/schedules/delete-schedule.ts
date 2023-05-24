import { ClientNotAuthorizedError } from '@/use-cases/errors/client-not-authorized-error'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'
import { makeDeleteScheduleUseCase } from '@/use-cases/messages/factories/make-delete-schedule-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function deleteSchedule(req: FastifyRequest, reply: FastifyReply) {
  const deleteScheduleParamsSchema = z.object({
    scheduleId: z.string(),
  })

  const { scheduleId } = deleteScheduleParamsSchema.parse(req.params)

  try {
    const deleteScheduleUseCase = makeDeleteScheduleUseCase()

    await deleteScheduleUseCase.execute({
      token: req.token,
      scheduleId,
    })

    return reply.status(204).send()
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ ok: false, message: error.message })
    }

    if (error instanceof ClientNotAuthorizedError) {
      return reply.status(401).send({ ok: false, message: error.message })
    }

    throw error
  }
}

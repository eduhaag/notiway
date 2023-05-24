import { ClientNotAuthorizedError } from '@/use-cases/errors/client-not-authorized-error'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'
import { makeUpdateScheduleUseCase } from '@/use-cases/messages/factories/make-update-schedule-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function updateSchedule(req: FastifyRequest, reply: FastifyReply) {
  const updateScheduleBodySchema = z.object({
    send_on: z.coerce.date().optional(),
    to: z.string().optional(),
  })

  const updateScheduleParamsSchema = z.object({
    scheduleId: z.string(),
  })

  const { to, send_on } = updateScheduleBodySchema.parse(req.body)
  const { scheduleId } = updateScheduleParamsSchema.parse(req.params)

  try {
    const updateScheduleUseCase = makeUpdateScheduleUseCase()

    await updateScheduleUseCase.execute({
      token: req.token,
      scheduleId,
      sendOn: send_on,
      to,
    })

    return reply.status(200).send({ ok: true, message: 'updated' })
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

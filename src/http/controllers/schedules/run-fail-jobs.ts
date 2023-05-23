import { makeRunFailJobsUseCase } from '@/use-cases/messages/factories/make-run-fail-jobs-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function runFailJobs(req: FastifyRequest, reply: FastifyReply) {
  const runFailJobsQueryParams = z.object({
    clientId: z.string().optional(),
  })

  const { clientId } = runFailJobsQueryParams.parse(req.query)

  try {
    const runFailJobsUseCase = makeRunFailJobsUseCase()

    await runFailJobsUseCase.execute({
      clientId,
    })

    return reply.status(204).send()
  } catch (error) {
    throw error
  }
}

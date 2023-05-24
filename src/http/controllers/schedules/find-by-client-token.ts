import { ClientNotAuthorizedError } from '@/use-cases/errors/client-not-authorized-error'
import { makeFindByClientTokenUseCase } from '@/use-cases/messages/factories/make-find-by-client-token-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function finScheduleByClientToken(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const findByClientTokenUseCase = makeFindByClientTokenUseCase()

    const messages = await findByClientTokenUseCase.execute({
      token: req.token,
    })

    return reply.status(200).send(messages)
  } catch (error) {
    if (error instanceof ClientNotAuthorizedError) {
      return reply.status(401).send({ ok: false, message: error.message })
    }

    throw error
  }
}

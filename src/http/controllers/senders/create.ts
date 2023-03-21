import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'
import { SenderFullNumberAlreadyExists } from '@/use-cases/errors/sender-full-number-already-exists-error'
import { SenderNameAlreadyExists } from '@/use-cases/errors/sender-name-already-exists-error'
import { makeCreateSenderUseCase } from '@/use-cases/senders/factories/make-create-sender-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function create(req: FastifyRequest, reply: FastifyReply) {
  const createSenderBodySchema = z.object({
    name: z.string(),
    fullNumber: z.string(),
    type: z.enum(['SHARED', 'PRIVATE', 'EXCLUSIVE']),
    consumerId: z.string().optional(),
    company: z.string().optional(),
    nationalCode: z.number().optional(),
    internacionalCode: z.number().optional(),
    region: z.string().optional(),
  })

  const data = createSenderBodySchema.parse(req.body)

  try {
    const createSenderUseCase = makeCreateSenderUseCase()

    await createSenderUseCase.execute(data)

    return reply.status(201).send()
  } catch (error) {
    if (error instanceof SenderFullNumberAlreadyExists) {
      return reply.status(409).send({ message: error.message })
    }

    if (error instanceof SenderNameAlreadyExists) {
      return reply.status(409).send({ message: error.message })
    }

    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}

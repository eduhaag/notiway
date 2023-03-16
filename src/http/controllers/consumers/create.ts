import { makeCreateConsumerUseCase } from '@/use-cases/consumers/factories/make-create-consumer-use-case'
import { EmailAlreadyUsedError } from '@/use-cases/errors/email-already-used-error'
import { TaxIdAlreadyExistsError } from '@/use-cases/errors/tax-id-already-exists-error'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function create(req: FastifyRequest, reply: FastifyReply) {
  const createConsumerBodySchema = z.object({
    name: z.string(),
    password: z.string(),
    email: z.string().email(),
    tax_id: z.string().optional(),
    fone: z.string().optional(),
    whatsapp: z.string().optional(),
    zip_code: z.string().optional(),
    street: z.string().optional(),
    number: z.string().optional(),
    complement: z.string().optional(),
    district: z.string().optional(),
    city: z.string().optional(),
    province: z.string().optional(),
    country: z.string().optional(),
    acceptMarketing: z.boolean().optional(),
  })

  const data = createConsumerBodySchema.parse(req.body)

  try {
    const createConsumerUseCase = makeCreateConsumerUseCase()

    await createConsumerUseCase.execute(data)

    return reply.status(201).send()
  } catch (error) {
    if (error instanceof EmailAlreadyUsedError) {
      return reply.status(409).send({ message: error.message })
    }
    if (error instanceof TaxIdAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }
}

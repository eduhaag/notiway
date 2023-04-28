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
    tax_id: z
      .string()
      .optional()
      .transform((value) => {
        return value && value.trim() !== '' ? value : undefined
      }),
    fone: z
      .string()
      .optional()
      .transform((value) => {
        return value && value.trim() !== '' ? value : undefined
      }),
    whatsapp: z
      .string()
      .optional()
      .transform((value) => {
        return value && value.trim() !== '' ? value : undefined
      }),
    zip_code: z
      .string()
      .optional()
      .transform((value) => {
        return value && value.trim() !== '' ? value : undefined
      }),
    street: z
      .string()
      .optional()
      .transform((value) => {
        return value && value.trim() !== '' ? value : undefined
      }),
    number: z
      .string()
      .optional()
      .transform((value) => {
        return value && value.trim() !== '' ? value : undefined
      }),
    complement: z
      .string()
      .optional()
      .transform((value) => {
        return value && value.trim() !== '' ? value : undefined
      }),
    district: z
      .string()
      .optional()
      .transform((value) => {
        return value && value.trim() !== '' ? value : undefined
      }),
    city: z
      .string()
      .optional()
      .transform((value) => {
        return value && value.trim() !== '' ? value : undefined
      }),
    province: z
      .string()
      .optional()
      .transform((value) => {
        return value && value.trim() !== '' ? value : undefined
      }),
    country: z
      .string()
      .optional()
      .transform((value) => {
        return value && value.trim() !== '' ? value : undefined
      }),
    marketingAgree: z.boolean().optional(),
    privacityTermsAgree: z.boolean(),
  })

  const data = createConsumerBodySchema.parse(req.body)

  if (!data.privacityTermsAgree) {
    return reply.status(401).send({ message: 'privacy terms must be accepted' })
  }

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

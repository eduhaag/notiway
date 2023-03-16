import { ConsumersRepository } from '@/respositories/consumers-repository'
import { Consumer } from '@prisma/client'
import { hash } from 'bcryptjs'
import { EmailAlreadyUsedError } from '../errors/email-already-used-error'
import { TaxIdAlreadyExistsError } from '../errors/tax-id-already-exists-error'

interface CreateConsumerUseCaseRequest {
  name: string
  tax_id?: string | null
  email: string
  fone?: string | null
  whatsapp?: string | null
  zip_code?: string | null
  street?: string | null
  number?: string | null
  complement?: string | null
  district?: string | null
  city?: string | null
  province?: string | null
  country?: string | null
  acceptMarketing?: boolean
  password: string
}

interface CreateConsumerUseCaseResponse {
  consumer: Consumer
}

export class CreateConsumerUseCase {
  constructor(private consumersRepository: ConsumersRepository) {}

  async execute(
    data: CreateConsumerUseCaseRequest,
  ): Promise<CreateConsumerUseCaseResponse> {
    const { email, tax_id, acceptMarketing = true } = data

    const emailAlreadyExists = await this.consumersRepository.findByEmail(email)

    if (emailAlreadyExists) {
      throw new EmailAlreadyUsedError()
    }

    if (tax_id) {
      const taxIdAlreadyExists = await this.consumersRepository.findByTaxId(
        tax_id,
      )

      if (taxIdAlreadyExists) {
        throw new TaxIdAlreadyExistsError()
      }
    }

    const password_hash = await hash(data.password, 6)

    const { password, ...dataWithoutPassword } = data

    const consumer = await this.consumersRepository.create({
      ...dataWithoutPassword,
      accept_marketing_at: acceptMarketing ? new Date() : null,
      User: {
        create: {
          email,
          password_hash,
        },
      },
    })

    return { consumer }
  }
}

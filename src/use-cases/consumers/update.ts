import { ConsumersRepository } from '@/respositories/consumers-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found'

interface UpdateConsumerUseCaseRequest {
  id: string
  name?: string
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
}

export class UpdateConsumerUseCase {
  constructor(private consumersRepository: ConsumersRepository) {}

  async execute(data: UpdateConsumerUseCaseRequest): Promise<void> {
    const consumer = await this.consumersRepository.findById(data.id)

    if (!consumer) {
      throw new ResourceNotFoundError()
    }

    const { acceptMarketing, ...dataWithoutAcceptMarketing } = data

    const consumerToSave = { ...consumer, ...dataWithoutAcceptMarketing }

    if (data.acceptMarketing !== undefined) {
      if (data.acceptMarketing && !consumer?.marketing_agree_at) {
        consumerToSave.marketing_agree_at = new Date()
      }
      if (!data.acceptMarketing) {
        consumerToSave.marketing_agree_at = null
      }
    }

    await this.consumersRepository.save(consumerToSave)
  }
}

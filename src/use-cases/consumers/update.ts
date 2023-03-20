import { ConsumersRepository } from '@/respositories/consumers-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found'

interface UpdateConsumerUseCaseRequest {
  consumerId: string
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
    const consumer = await this.consumersRepository.findById(data.consumerId)

    if (!consumer) {
      throw new ResourceNotFoundError()
    }

    const consumerToSave = { ...consumer, ...data }

    if (data.acceptMarketing !== undefined) {
      if (data.acceptMarketing && !consumer?.accept_marketing_at) {
        consumerToSave.accept_marketing_at = new Date()
      }
      if (!data.acceptMarketing) {
        consumerToSave.accept_marketing_at = null
      }
    }

    await this.consumersRepository.save(consumerToSave)
  }
}

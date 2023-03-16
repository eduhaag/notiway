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

    if (data.acceptMarketing !== undefined) {
      if (data.acceptMarketing && !consumer?.accept_marketing_at) {
        consumer.accept_marketing_at = new Date()
      }
      if (!data.acceptMarketing) {
        consumer.accept_marketing_at = null
      }
    }

    consumer.city = data.city !== undefined ? data.city : consumer.city
    consumer.street = data.street !== undefined ? data.street : consumer.street
    consumer.zip_code =
      data.zip_code !== undefined ? data.zip_code : consumer.zip_code
    consumer.whatsapp =
      data.whatsapp !== undefined ? data.whatsapp : consumer.whatsapp
    consumer.name = data.name !== undefined ? data.name : consumer.name
    consumer.province =
      data.province !== undefined ? data.province : consumer.province
    consumer.number = data.number !== undefined ? data.number : consumer.number
    consumer.fone = data.fone !== undefined ? data.fone : consumer.fone
    consumer.district =
      data.district !== undefined ? data.district : consumer.district
    consumer.country =
      data.country !== undefined ? data.country : consumer.country
    consumer.complement =
      data.complement !== undefined ? data.complement : consumer.complement

    await this.consumersRepository.save(consumer)
  }
}

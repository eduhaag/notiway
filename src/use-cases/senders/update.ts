import { ConsumersRepository } from '@/respositories/consumers-repository'
import { SendersRepository } from '@/respositories/senders-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found'

interface UpdateSenderUseCaseRequest {
  id: string
  type?: 'SHARED' | 'EXCLUSIVE' | 'PRIVATE'
  consumer_id?: string
  company?: string
  national_code?: number
  internacional_code?: number
  region?: string
  last_recharge?: Date
}

export class UpdateSenderUseCase {
  constructor(
    private sendersRepository: SendersRepository,
    private consumersRepository: ConsumersRepository,
  ) {}

  async execute(data: UpdateSenderUseCaseRequest): Promise<void> {
    const { id, consumer_id } = data

    const sender = await this.sendersRepository.findById(id)

    if (!sender) {
      throw new ResourceNotFoundError()
    }

    if (consumer_id && consumer_id !== sender.consumer_id) {
      const consumerExists = await this.consumersRepository.findById(
        consumer_id,
      )

      if (!consumerExists) {
        throw new ResourceNotFoundError()
      }
    }

    await this.sendersRepository.save({ ...sender, ...data })
  }
}

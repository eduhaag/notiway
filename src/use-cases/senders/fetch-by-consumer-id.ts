import { SendersRepository } from '@/respositories/senders-repository'
import { Sender } from '@prisma/client'

interface FetchSendersByConsumerIdUseCaseRequest {
  consumerId: string
}

interface FetchSendersByConsumerIdUseCaseResponse {
  senders: Sender[]
}

export class FetchSendersByConsumerIdUseCase {
  constructor(private sendersRepository: SendersRepository) {}

  async execute({
    consumerId,
  }: FetchSendersByConsumerIdUseCaseRequest): Promise<FetchSendersByConsumerIdUseCaseResponse> {
    const senders = await this.sendersRepository.findManyByConsumerId(
      consumerId,
    )

    const sendersToReturn = senders.map((sender) => {
      return {
        ...sender,
        api_token: 'ommited',
      }
    })

    return { senders: sendersToReturn }
  }
}

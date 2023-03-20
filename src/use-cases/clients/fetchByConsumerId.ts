import { ClientsRepository } from '@/respositories/clients-repository'
import { Client } from '@prisma/client'

interface FetchByConsumerIdUseCaseRequest {
  consumerId: string
}

interface FetchByConsumerIdUseCaseResponse {
  clients: Client[]
}

export class FetchByConsumerIdUseCase {
  constructor(private clientsRepository: ClientsRepository) {}

  async execute({
    consumerId,
  }: FetchByConsumerIdUseCaseRequest): Promise<FetchByConsumerIdUseCaseResponse> {
    const clients = await this.clientsRepository.findByConsumerId(consumerId)

    return { clients }
  }
}

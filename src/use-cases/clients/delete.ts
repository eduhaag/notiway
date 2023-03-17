import { ClientsRepository } from '@/respositories/clients-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found'
import { ClientTokensRepository } from '@/respositories/client-tokens-repository'

interface DeleteUseCaseRequest {
  clientId: string
}

export class DeleteUseCase {
  constructor(
    private clientsRepository: ClientsRepository,
    private clientTokensRepository: ClientTokensRepository,
  ) {}

  async execute({ clientId }: DeleteUseCaseRequest): Promise<void> {
    const client = await this.clientsRepository.findById(clientId)

    if (!client) {
      throw new ResourceNotFoundError()
    }

    await this.clientTokensRepository.deleteByClientId(client.id)

    await this.clientsRepository.delete(client.id)
  }
}

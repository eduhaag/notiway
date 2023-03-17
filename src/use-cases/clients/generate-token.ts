import { ClientsRepository } from '@/respositories/clients-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found'
import { ClientTokensRepository } from '@/respositories/client-tokens-repository'
import { generateClientToken } from '@/utils/generate-client-token'

interface GenerateTokenUseCaseRequest {
  clientId: string
}

interface GenerateTokenUseCaseResponse {
  token: string
}

export class GenerateTokenUseCase {
  constructor(
    private clientsRepository: ClientsRepository,
    private clientTokensRepository: ClientTokensRepository,
  ) {}

  async execute({
    clientId,
  }: GenerateTokenUseCaseRequest): Promise<GenerateTokenUseCaseResponse> {
    const client = await this.clientsRepository.findById(clientId)

    if (!client) {
      throw new ResourceNotFoundError()
    }

    const token = await generateClientToken(client.id)

    await this.clientTokensRepository.updateByClientId({
      client_id: client.id,
      token,
    })

    return { token }
  }
}

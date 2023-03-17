import { ClientsRepository } from '@/respositories/clients-repository'
import { ConsumersRepository } from '@/respositories/consumers-repository'
import { SendersRepository } from '@/respositories/senders-repository'
import { Client } from '@prisma/client'
import { ResourceNotFoundError } from '../errors/resource-not-found'
import { ClientTokensRepository } from '@/respositories/client-tokens-repository'
import { generateClientToken } from '@/utils/generate-client-token'

interface CreateClientUseCaseRequest {
  name: string
  status?: string
  header?: string
  footer?: string
  consumer_id: string
  sender_id?: string
}

interface CreateClientUseCaseResponse {
  client: Client
  token: string
}

export class CreateClientUseCase {
  constructor(
    private clientsRepository: ClientsRepository,
    private consumersRepository: ConsumersRepository,
    private sendersRepository: SendersRepository,
    private clientTokensRepository: ClientTokensRepository,
  ) {}

  async execute(
    data: CreateClientUseCaseRequest,
  ): Promise<CreateClientUseCaseResponse> {
    const { consumer_id, sender_id } = data

    const consumerExists = await this.consumersRepository.findById(consumer_id)

    if (!consumerExists) {
      throw new ResourceNotFoundError()
    }

    if (sender_id) {
      const senderExists = await this.sendersRepository.findById(sender_id)

      if (!senderExists) {
        throw new ResourceNotFoundError()
      }
    }

    const client = await this.clientsRepository.create({ ...data })

    const token = await generateClientToken(client.id)

    await this.clientTokensRepository.create({ client_id: client.id, token })

    return { client, token }
  }
}

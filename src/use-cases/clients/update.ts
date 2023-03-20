import { SendersRepository } from '@/respositories/senders-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found'
import { ClientsRepository } from '@/respositories/clients-repository'

interface UpdateClientUseCaseRequest {
  client_id: string
  sender_id?: string
  name?: string
  status?: string
  header?: string
  footer?: string
}

export class UpdateClientUseCase {
  constructor(
    private clientsRepository: ClientsRepository,
    private sendersRepository: SendersRepository,
  ) {}

  async execute(data: UpdateClientUseCaseRequest): Promise<void> {
    const { client_id, sender_id } = data

    let client = await this.clientsRepository.findById(client_id)

    if (!client) {
      throw new ResourceNotFoundError()
    }

    if (sender_id && sender_id !== client.sender_id) {
      const SenderExistis = await this.sendersRepository.findById(sender_id)

      if (!SenderExistis) {
        throw new ResourceNotFoundError()
      }
    }
    client = { ...client!, ...data }

    await this.clientsRepository.save(client)
  }
}

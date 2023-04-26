import { SendersRepository } from '@/respositories/senders-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found'
import { api } from '@/lib/axios'

interface DisconnectSenderUseCaseRequest {
  senderId: string
}

export class DisconnectSenderUseCase {
  constructor(private sendersRepository: SendersRepository) {}

  async execute({ senderId }: DisconnectSenderUseCaseRequest): Promise<void> {
    const sender = await this.sendersRepository.findById(senderId)

    if (!sender) {
      throw new ResourceNotFoundError()
    }

    try {
      const { data } = await api.post(
        `/${sender.name}/logout-session`,
        {},
        {
          headers: {
            Authorization: `Bearer ${sender.api_token}`,
          },
        },
      )

      if (data.status) {
        await this.sendersRepository.save({ ...sender, paread_at: null })
      }
    } catch (error) {
      throw error
    }
  }
}

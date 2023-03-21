import { SendersRepository } from '@/respositories/senders-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found'
import { api } from '@/lib/axios'

interface ToggleSenderUseCaseRequest {
  senderId: string
  isEnabled: boolean
}

export class ToggleSenderUseCase {
  constructor(private sendersRepository: SendersRepository) {}

  async execute({
    senderId,
    isEnabled,
  }: ToggleSenderUseCaseRequest): Promise<void> {
    const sender = await this.sendersRepository.findById(senderId)

    if (!sender) {
      throw new ResourceNotFoundError()
    }

    if (isEnabled) {
      sender.disabled_at = null
    } else {
      try {
        await api.post(
          `/${sender.name}/close-session`,
          {},
          {
            headers: {
              Authorization: `Bearer ${sender.api_token}`,
            },
          },
        )
      } catch (error) {
        throw error
      }

      sender.disabled_at = new Date()
    }

    await this.sendersRepository.save(sender)
  }
}

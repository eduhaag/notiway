import { SendersRepository } from '@/respositories/senders-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found'

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
      sender.disabled_at = new Date()
    }

    await this.sendersRepository.save(sender)
  }
}

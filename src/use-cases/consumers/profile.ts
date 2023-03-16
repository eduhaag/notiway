import { ConsumersRepository } from '@/respositories/consumers-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found'
import { Consumer } from '@prisma/client'

interface ProfileUseCaseRequest {
  consumerId: string
}

interface ProfileUseCaseResponse {
  consumer: Consumer
}

export class ProfileUseCase {
  constructor(private consumersRepository: ConsumersRepository) {}

  async execute({
    consumerId,
  }: ProfileUseCaseRequest): Promise<ProfileUseCaseResponse> {
    const consumer = await this.consumersRepository.findById(consumerId)

    if (!consumer) {
      throw new ResourceNotFoundError()
    }

    return { consumer }
  }
}

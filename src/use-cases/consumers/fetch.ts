import { ConsumersRepository } from '@/respositories/consumers-repository'
import { Consumer } from '@prisma/client'

interface FetchUseCaseRequest {
  taxId?: string
  name?: string
  email?: string
  acceptMarketing?: boolean
}

interface FetchUseCaseResponse {
  consumers: Consumer[]
}

export class FetchConsumersUseCase {
  constructor(private consumersRepository: ConsumersRepository) {}

  async execute({
    acceptMarketing,
    email,
    name,
    taxId,
  }: FetchUseCaseRequest): Promise<FetchUseCaseResponse> {
    const consumers = await this.consumersRepository.findManyWithFilter({
      acceptMarketing,
      email,
      name,
      taxId,
    })

    return { consumers }
  }
}

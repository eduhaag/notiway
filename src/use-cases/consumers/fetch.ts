import { ConsumersRepository } from '@/respositories/consumers-repository'
import { Consumer } from '@prisma/client'

interface FetchUseCaseRequest {
  taxId?: string
  name?: string
  email?: string
  marketingAgree?: boolean
}

interface FetchUseCaseResponse {
  consumers: Consumer[]
}

export class FetchConsumersUseCase {
  constructor(private consumersRepository: ConsumersRepository) {}

  async execute({
    marketingAgree,
    email,
    name,
    taxId,
  }: FetchUseCaseRequest): Promise<FetchUseCaseResponse> {
    const consumers = await this.consumersRepository.findManyWithFilter({
      marketingAgree,
      email,
      name,
      taxId,
    })

    return { consumers }
  }
}

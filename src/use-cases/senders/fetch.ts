import { SendersRepository } from '@/respositories/senders-repository'
import { Sender } from '@prisma/client'

interface FetchSendersUseCaseRequest {
  type?: 'SHARED' | 'EXCLUSIVE' | 'PRIVATE'
  enabled?: boolean
  nationalCode?: number
  lastRecharge?: {
    from: Date
    to: Date
  }
}

interface FetchSendersUseCaseResponse {
  senders: Sender[]
}

export class FetchSendersUseCase {
  constructor(private sendersRepository: SendersRepository) {}

  async execute(
    data: FetchSendersUseCaseRequest,
  ): Promise<FetchSendersUseCaseResponse> {
    const senders = await this.sendersRepository.findManyWithFilter(data)

    return { senders }
  }
}

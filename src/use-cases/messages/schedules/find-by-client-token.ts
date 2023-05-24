import { ClientTokensRepository } from '@/respositories/client-tokens-repository'
import { ClientNotAuthorizedError } from '@/use-cases/errors/client-not-authorized-error'
import { jobToMessageMapper } from '../mappers/job-to-message-mapper'
import { MessageTypes } from '@/DTOS/message-types'
import { QueuesProvider } from '@/providers/queues-provider'

interface FindByClientTokenUseCaseRequest {
  token: string
}

interface FindByClientTokenUseCaseResponse {
  messages: {
    schedule_id: string
    send_on: Date | null | undefined
    to: string
    content: MessageTypes
  }[]
}

export class FindByClientTokenUseCase {
  constructor(
    private clientTokensRepository: ClientTokensRepository,
    private queuesProvider: QueuesProvider,
  ) {}

  async execute({
    token,
  }: FindByClientTokenUseCaseRequest): Promise<FindByClientTokenUseCaseResponse> {
    const clientToken = await this.clientTokensRepository.findByToken(token)

    if (!clientToken) {
      throw new ClientNotAuthorizedError()
    }

    const jobs = await this.queuesProvider.findJobByClientId(
      clientToken.client.id,
    )

    const response = jobs
      .filter((job) => !job.failCount)
      .map((job) => {
        return jobToMessageMapper(job)
      })

    return { messages: response }
  }
}

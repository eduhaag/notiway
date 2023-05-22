import { queue } from '@/app'
import { ClientTokensRepository } from '@/respositories/client-tokens-repository'
import { ClientNotAuthorizedError } from '@/use-cases/errors/client-not-authorized-error'
import { jobToMessageMapper } from '../mappers/job-to-message-mapper'
import { MessageTypes } from '@/DTOS/message-types'

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
  constructor(private clientTokensRepository: ClientTokensRepository) {}

  async execute({
    token,
  }: FindByClientTokenUseCaseRequest): Promise<FindByClientTokenUseCaseResponse> {
    const clientToken = await this.clientTokensRepository.findByToken(token)

    if (!clientToken) {
      throw new ClientNotAuthorizedError()
    }

    const jobs = await queue.findJobByClientId(clientToken.client.id)

    const response = jobs.map((job) => {
      return jobToMessageMapper(job)
    })

    return { messages: response }
  }
}

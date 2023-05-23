import { QueuesProvider } from '@/providers/queues-provider'
import { ClientTokensRepository } from '@/respositories/client-tokens-repository'
import { ClientNotAuthorizedError } from '@/use-cases/errors/client-not-authorized-error'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'

interface RunScheduleByIdUseCaseRequest {
  token: string
  scheduleId: string
}

export class RunScheduleByIdUseCase {
  constructor(
    private clientTokensRepository: ClientTokensRepository,
    private queuesProvider: QueuesProvider,
  ) {}

  async execute({
    scheduleId,
    token,
  }: RunScheduleByIdUseCaseRequest): Promise<void> {
    const clientToken = await this.clientTokensRepository.findByToken(token)

    if (!clientToken) {
      throw new ClientNotAuthorizedError()
    }

    const job = await this.queuesProvider.findJobById(scheduleId)

    if (!job) {
      throw new ResourceNotFoundError()
    }

    if (job.data.clientId !== clientToken.client.id) {
      throw new ClientNotAuthorizedError()
    }

    await this.queuesProvider.runJob(job.id)
  }
}

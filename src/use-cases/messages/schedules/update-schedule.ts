import { QueuesProvider } from '@/providers/queues-provider'
import { ClientTokensRepository } from '@/respositories/client-tokens-repository'
import { ClientNotAuthorizedError } from '@/use-cases/errors/client-not-authorized-error'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'

interface UpdateScheduleUseCaseRequest {
  token: string
  scheduleId: string
  sendOn?: Date
  to?: string
}

export class UpdateScheduleUseCase {
  constructor(
    private clientTokensRepository: ClientTokensRepository,
    private queuesProvider: QueuesProvider,
  ) {}

  async execute({
    scheduleId,
    token,
    to,
    sendOn,
  }: UpdateScheduleUseCaseRequest): Promise<void> {
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

    await this.queuesProvider.jobUpdate({
      jobId: job.id,
      to,
      sendOn: sendOn && new Date(sendOn),
    })
  }
}

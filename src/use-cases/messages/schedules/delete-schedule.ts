import { ClientTokensRepository } from '@/respositories/client-tokens-repository'
import { JobsRepository } from '@/respositories/jobs-repository'
import { ClientNotAuthorizedError } from '@/use-cases/errors/client-not-authorized-error'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'

interface DeleteScheduleUseCaseRequest {
  token: string
  scheduleId: string
}

export class DeleteScheduleUseCase {
  constructor(
    private jobsRepository: JobsRepository,
    private clientTokensRepository: ClientTokensRepository,
  ) {}

  async execute({
    scheduleId,
    token,
  }: DeleteScheduleUseCaseRequest): Promise<void> {
    const clientToken = await this.clientTokensRepository.findByToken(token)

    if (!clientToken) {
      throw new ClientNotAuthorizedError()
    }

    const job = await this.jobsRepository.get(scheduleId)

    if (!job) {
      throw new ResourceNotFoundError()
    }

    if (job.data.cliendId !== clientToken.client.id) {
      throw new ClientNotAuthorizedError()
    }

    await this.jobsRepository.delete(scheduleId)
  }
}

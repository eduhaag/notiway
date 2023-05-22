import { queue } from '@/app'
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
  constructor(private clientTokensRepository: ClientTokensRepository) {}

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

    const job = await queue.findJobById(scheduleId)

    if (!job) {
      throw new ResourceNotFoundError()
    }

    if (job.attrs.data.clientId !== clientToken.client.id) {
      throw new ClientNotAuthorizedError()
    }

    if (to) {
      job.attrs.data.to = to
    }

    if (sendOn) {
      job.schedule(new Date(sendOn))
    }

    job.save()
  }
}

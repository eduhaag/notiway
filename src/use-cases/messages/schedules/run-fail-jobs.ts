import { QueuesProvider } from '@/providers/queues-provider'

interface RunFailJobsUseCaseRequest {
  clientId?: string
}

export class RunFailJobsUseCase {
  constructor(private queuesProvider: QueuesProvider) {}

  async execute({ clientId }: RunFailJobsUseCaseRequest): Promise<void> {
    await this.queuesProvider.runJobsWithFail(clientId)
  }
}

import { QueuesProvider } from '@/providers/queues-provider'

interface RunFailedJobsUseCaseRequest {
  clientId?: string
}

export class RunFailedSchedulesUseCase {
  constructor(private queuesProvider: QueuesProvider) {}

  async execute({ clientId }: RunFailedJobsUseCaseRequest): Promise<void> {
    await this.queuesProvider.runFailedJobs(clientId)
  }
}

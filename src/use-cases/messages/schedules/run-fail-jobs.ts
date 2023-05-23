import { queue } from '@/app'

interface RunFailJobsUseCaseRequest {
  clientId?: string
}

export class RunFailJobsUseCase {
  async execute({ clientId }: RunFailJobsUseCaseRequest): Promise<void> {
    const jobs = await queue.listJobsWithFail(clientId)

    jobs.forEach(async (job) => {
      await job.run()
    })
  }
}

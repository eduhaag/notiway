import { PrismaClientTokensRepository } from '@/respositories/prisma/prisma-client-tokens-repository'
import { DeleteScheduleUseCase } from '../schedules/delete-schedule'
import { MongoJobsRepository } from '@/respositories/mongo/mongo-jobs-repository'

export function makeDeleteScheduleUseCase() {
  const jobsRepository = new MongoJobsRepository()
  const clientTokensRepository = new PrismaClientTokensRepository()
  const useCase = new DeleteScheduleUseCase(
    jobsRepository,
    clientTokensRepository,
  )

  return useCase
}

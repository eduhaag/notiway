import { DeleteScheduleUseCase } from '../schedules/delete-schedule'
import { MongoJobsRepository } from '@/respositories/mongo/mongo-jobs-repository'

export function makeDeleteScheduleUseCase() {
  const jobsRepository = new MongoJobsRepository()
  const useCase = new DeleteScheduleUseCase(jobsRepository)

  return useCase
}

import { PrismaClientTokensRepository } from '@/respositories/prisma/prisma-client-tokens-repository'
import { RunScheduleByIdUseCase } from '../schedules/run-schedule-by-id'
import { queuesProvider } from '@/app'

export function makeRunScheduleByIdUseCase() {
  const clientTokensRepository = new PrismaClientTokensRepository()
  const useCase = new RunScheduleByIdUseCase(
    clientTokensRepository,
    queuesProvider,
  )

  return useCase
}

import { PrismaClientTokensRepository } from '@/respositories/prisma/prisma-client-tokens-repository'
import { UpdateScheduleUseCase } from '../schedules/update-schedule'

export function makeUpdateScheduleUseCase() {
  const clientTokensRepository = new PrismaClientTokensRepository()
  const useCase = new UpdateScheduleUseCase(clientTokensRepository)

  return useCase
}

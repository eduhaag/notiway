import { PrismaClientTokensRepository } from '@/respositories/prisma/prisma-client-tokens-repository'
import { DeleteScheduleUseCase } from '../schedules/delete-schedule'

export function makeDeleteScheduleUseCase() {
  const clientTokensRepository = new PrismaClientTokensRepository()
  const useCase = new DeleteScheduleUseCase(clientTokensRepository)

  return useCase
}

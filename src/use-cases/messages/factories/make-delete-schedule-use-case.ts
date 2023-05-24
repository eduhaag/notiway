import { PrismaClientTokensRepository } from '@/respositories/prisma/prisma-client-tokens-repository'
import { DeleteScheduleUseCase } from '../schedules/delete-schedule'
import { queuesProvider } from '@/app'

export function makeDeleteScheduleUseCase() {
  const clientTokensRepository = new PrismaClientTokensRepository()
  const useCase = new DeleteScheduleUseCase(
    clientTokensRepository,
    queuesProvider,
  )

  return useCase
}

import { PrismaClientTokensRepository } from '@/respositories/prisma/prisma-client-tokens-repository'
import { FindByClientTokenUseCase } from '../schedules/find-by-client-token'
import { queuesProvider } from '@/app'

export function makeFindByClientTokenUseCase() {
  const clientTokensRepository = new PrismaClientTokensRepository()
  const useCase = new FindByClientTokenUseCase(
    clientTokensRepository,
    queuesProvider,
  )

  return useCase
}

import { PrismaClientTokensRepository } from '@/respositories/prisma/prisma-client-tokens-repository'
import { SendLocationUseCase } from '../send-location'

export function makeSendLocationUseCase() {
  const clientTokensRepository = new PrismaClientTokensRepository()

  const useCase = new SendLocationUseCase(clientTokensRepository)

  return useCase
}

import { PrismaClientTokensRepository } from '@/respositories/prisma/prisma-client-tokens-repository'
import { SendTextUseCase } from '../send-text'

export function makeSendTextUseCase() {
  const clientTokensRepository = new PrismaClientTokensRepository()
  const useCase = new SendTextUseCase(clientTokensRepository)

  return useCase
}

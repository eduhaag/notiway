import { PrismaClientTokensRepository } from '@/respositories/prisma/prisma-client-tokens-repository'
import { SendTextUseCase } from '../send-text'
import { queuesProvider } from '@/app'

export function makeSendTextUseCase() {
  const clientTokensRepository = new PrismaClientTokensRepository()
  const useCase = new SendTextUseCase(clientTokensRepository, queuesProvider)

  return useCase
}

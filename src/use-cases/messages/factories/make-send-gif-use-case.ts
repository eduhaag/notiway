import { PrismaClientTokensRepository } from '@/respositories/prisma/prisma-client-tokens-repository'
import { SendGifUseCase } from '../send-gif'
import { queuesProvider } from '@/app'

export function makeSendGifUseCase() {
  const clientTokensRepository = new PrismaClientTokensRepository()
  const useCase = new SendGifUseCase(clientTokensRepository, queuesProvider)

  return useCase
}

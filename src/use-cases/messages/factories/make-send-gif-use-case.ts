import { PrismaClientTokensRepository } from '@/respositories/prisma/prisma-client-tokens-repository'
import { SendGifUseCase } from '../send-gif'

export function makeSendGifUseCase() {
  const clientTokensRepository = new PrismaClientTokensRepository()
  const useCase = new SendGifUseCase(clientTokensRepository)

  return useCase
}

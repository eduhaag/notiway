import { PrismaClientTokensRepository } from '@/respositories/prisma/prisma-client-tokens-repository'
import { SendStickerUseCase } from '../send-sticker'
import { queuesProvider } from '@/app'

export function makeSendStickerUseCase() {
  const clientTokensRepository = new PrismaClientTokensRepository()
  const useCase = new SendStickerUseCase(clientTokensRepository, queuesProvider)

  return useCase
}

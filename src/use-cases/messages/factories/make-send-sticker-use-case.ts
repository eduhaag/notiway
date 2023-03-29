import { PrismaClientTokensRepository } from '@/respositories/prisma/prisma-client-tokens-repository'
import { SendStickerUseCase } from '../send-sticker'

export function makeSendStickerUseCase() {
  const clientTokensRepository = new PrismaClientTokensRepository()
  const useCase = new SendStickerUseCase(clientTokensRepository)

  return useCase
}

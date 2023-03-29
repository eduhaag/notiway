import { PrismaClientTokensRepository } from '@/respositories/prisma/prisma-client-tokens-repository'
import { SendContactUseCase } from '../send-contact'

export function makeSendContactUseCase() {
  const clientTokensRepository = new PrismaClientTokensRepository()
  const useCase = new SendContactUseCase(clientTokensRepository)

  return useCase
}

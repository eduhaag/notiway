import { PrismaClientTokensRepository } from '@/respositories/prisma/prisma-client-tokens-repository'
import { SendFileUseCase } from '../send-file'

export function makeSendFileUseCase() {
  const clientTokensRepository = new PrismaClientTokensRepository()
  const useCase = new SendFileUseCase(clientTokensRepository)

  return useCase
}

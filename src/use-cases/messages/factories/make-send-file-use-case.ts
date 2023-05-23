import { PrismaClientTokensRepository } from '@/respositories/prisma/prisma-client-tokens-repository'
import { SendFileUseCase } from '../send-file'
import { queuesProvider } from '@/app'

export function makeSendFileUseCase() {
  const clientTokensRepository = new PrismaClientTokensRepository()
  const useCase = new SendFileUseCase(clientTokensRepository, queuesProvider)

  return useCase
}

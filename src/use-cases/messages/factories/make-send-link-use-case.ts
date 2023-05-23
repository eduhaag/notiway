import { PrismaClientTokensRepository } from '@/respositories/prisma/prisma-client-tokens-repository'
import { SendLinkUseCase } from '../send-link'
import { queuesProvider } from '@/app'

export function makeSendLinkUseCase() {
  const clientTokensRepository = new PrismaClientTokensRepository()

  const useCase = new SendLinkUseCase(clientTokensRepository, queuesProvider)

  return useCase
}

import { PrismaClientTokensRepository } from '@/respositories/prisma/prisma-client-tokens-repository'
import { SendContactUseCase } from '../send-contact'
import { queuesProvider } from '@/app'

export function makeSendContactUseCase() {
  const clientTokensRepository = new PrismaClientTokensRepository()
  const useCase = new SendContactUseCase(clientTokensRepository, queuesProvider)

  return useCase
}

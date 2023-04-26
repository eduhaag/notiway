import { PrismaSendersRepository } from '@/respositories/prisma/prisma-senders-repository'
import { DisconnectSenderUseCase } from '../disconnect'

export function makeDisconnectSenderUseCase() {
  const sendersRepository = new PrismaSendersRepository()

  const useCase = new DisconnectSenderUseCase(sendersRepository)

  return useCase
}

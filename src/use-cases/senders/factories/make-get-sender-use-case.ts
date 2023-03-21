import { PrismaSendersRepository } from '@/respositories/prisma/prisma-senders-repository'
import { GetSenderUseCase } from '../get-sender'

export function makeGetSenderUseCase() {
  const sendersRepository = new PrismaSendersRepository()

  const useCase = new GetSenderUseCase(sendersRepository)

  return useCase
}

import { PrismaSendersRepository } from '@/respositories/prisma/prisma-senders-repository'
import { FetchSendersUseCase } from '../fetch'

export function makeFetchSendersUseCase() {
  const sendersRepository = new PrismaSendersRepository()

  const useCase = new FetchSendersUseCase(sendersRepository)

  return useCase
}

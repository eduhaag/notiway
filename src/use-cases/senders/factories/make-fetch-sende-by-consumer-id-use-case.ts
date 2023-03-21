import { PrismaSendersRepository } from '@/respositories/prisma/prisma-senders-repository'
import { FetchSendersByConsumerIdUseCase } from '../fetch-by-consumer-id'

export function makeFetchSendersByConsumerIdUseCase() {
  const sendersRepository = new PrismaSendersRepository()

  const useCase = new FetchSendersByConsumerIdUseCase(sendersRepository)

  return useCase
}

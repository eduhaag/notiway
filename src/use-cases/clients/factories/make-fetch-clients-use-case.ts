import { PrismaClientsRepository } from '@/respositories/prisma/prisma-clients-repository'
import { FetchByConsumerIdUseCase } from '../fetchByConsumerId'

export function makeFetchClientUseCase() {
  const clientsRepository = new PrismaClientsRepository()

  const useCase = new FetchByConsumerIdUseCase(clientsRepository)

  return useCase
}

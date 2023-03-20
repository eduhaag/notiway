import { PrismaClientsRepository } from '@/respositories/prisma/prisma-clients-repository'
import { UpdateClientUseCase } from '../update'
import { PrismaSendersRepository } from '@/respositories/prisma/prisma-senders-repository'

export function makeUpdateClientUseCase() {
  const clientsRepository = new PrismaClientsRepository()
  const sendersRepository = new PrismaSendersRepository()

  const useCase = new UpdateClientUseCase(clientsRepository, sendersRepository)

  return useCase
}

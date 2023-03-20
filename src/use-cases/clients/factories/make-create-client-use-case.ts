import { PrismaClientsRepository } from '@/respositories/prisma/prisma-clients-repository'
import { CreateClientUseCase } from '../create'
import { PrismaConsumersRepository } from '@/respositories/prisma/prisma-consumers-repository'
import { PrismaSendersRepository } from '@/respositories/prisma/prisma-senders-repository'
import { PrismaClientTokensRepository } from '@/respositories/prisma/prisma-client-tokens-repository'

export function makeCreateClientUseCase() {
  const clientsRepository = new PrismaClientsRepository()
  const consumersRepository = new PrismaConsumersRepository()
  const senderRepository = new PrismaSendersRepository()
  const clientTokensRepository = new PrismaClientTokensRepository()

  const useCase = new CreateClientUseCase(
    clientsRepository,
    consumersRepository,
    senderRepository,
    clientTokensRepository,
  )

  return useCase
}

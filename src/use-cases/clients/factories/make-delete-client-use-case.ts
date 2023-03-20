import { PrismaClientsRepository } from '@/respositories/prisma/prisma-clients-repository'
import { DeleteUseCase } from '../delete'
import { PrismaClientTokensRepository } from '@/respositories/prisma/prisma-client-tokens-repository'

export function makeDeleteClientUseCase() {
  const clientsRepository = new PrismaClientsRepository()
  const clienTokensRepository = new PrismaClientTokensRepository()

  const useCase = new DeleteUseCase(clientsRepository, clienTokensRepository)

  return useCase
}

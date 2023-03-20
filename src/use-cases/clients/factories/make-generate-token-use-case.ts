import { PrismaClientsRepository } from '@/respositories/prisma/prisma-clients-repository'
import { GenerateTokenUseCase } from '../generate-token'
import { PrismaClientTokensRepository } from '@/respositories/prisma/prisma-client-tokens-repository'

export function makeGenerateClientTokenUseCase() {
  const clientsRepository = new PrismaClientsRepository()
  const clientTokensRepository = new PrismaClientTokensRepository()

  const useCase = new GenerateTokenUseCase(
    clientsRepository,
    clientTokensRepository,
  )

  return useCase
}

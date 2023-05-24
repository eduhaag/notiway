import { PrismaUserTokensRepository } from '@/respositories/prisma/prisma-user-tokens-repository'
import { CreateConsumerUseCase } from '../create'
import { PrismaConsumersRepository } from '@/respositories/prisma/prisma-consumers-repository'
import { PrismaUsersRepository } from '@/respositories/prisma/prisma-users-repository'
import { queuesProvider } from '@/app'

export function makeCreateConsumerUseCase() {
  const prismaConsumersRepository = new PrismaConsumersRepository()
  const prismaUserTokensRepository = new PrismaUserTokensRepository()
  const prismaUsersRepository = new PrismaUsersRepository()
  const createUsersUseCase = new CreateConsumerUseCase(
    prismaConsumersRepository,
    prismaUsersRepository,
    prismaUserTokensRepository,
    queuesProvider,
  )

  return createUsersUseCase
}

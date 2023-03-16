import { CreateConsumerUseCase } from '../create'
import { PrismaConsumersRepository } from '@/respositories/prisma/prisma-consumers-repository'

export function makeCreateConsumerUseCase() {
  const prismaConsumersRepository = new PrismaConsumersRepository()
  const createUsersUseCase = new CreateConsumerUseCase(
    prismaConsumersRepository,
  )

  return createUsersUseCase
}

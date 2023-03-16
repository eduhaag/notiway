import { PrismaConsumersRepository } from '@/respositories/prisma/prisma-consumers-repository'
import { FetchConsumersUseCase } from '../fetch'

export function makeFetchConsumersUseCase() {
  const prismaConsumersRepository = new PrismaConsumersRepository()
  const fetchUsersUseCase = new FetchConsumersUseCase(prismaConsumersRepository)

  return fetchUsersUseCase
}

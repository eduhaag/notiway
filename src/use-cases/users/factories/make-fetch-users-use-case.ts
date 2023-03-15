import { PrismaUsersRepository } from '@/respositories/prisma/prisma-users-repository'
import { FetchUsersUseCase } from '../fetch'

export function makeFetchUsersUseCase() {
  const prismaUsersRepository = new PrismaUsersRepository()
  const fetchUsersUseCase = new FetchUsersUseCase(prismaUsersRepository)

  return fetchUsersUseCase
}

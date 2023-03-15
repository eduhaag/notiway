import { PrismaUsersRepository } from '@/respositories/prisma/prisma-users-repository'
import { CreateUserUseCase } from '../create'

export function makeCreateUserUseCase() {
  const prismaUsersRepository = new PrismaUsersRepository()
  const createUserUseCase = new CreateUserUseCase(prismaUsersRepository)

  return createUserUseCase
}

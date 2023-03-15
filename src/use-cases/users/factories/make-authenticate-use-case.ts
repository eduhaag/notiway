import { PrismaUsersRepository } from '@/respositories/prisma/prisma-users-repository'
import { AuthenticateUseCase } from '../authenticate'

export function makeAuthenticateUseCase() {
  const prismaUsersRepository = new PrismaUsersRepository()
  const autheticateUseCase = new AuthenticateUseCase(prismaUsersRepository)

  return autheticateUseCase
}

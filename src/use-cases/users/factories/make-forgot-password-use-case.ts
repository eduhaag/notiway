import { PrismaUsersRepository } from '@/respositories/prisma/prisma-users-repository'
import { ForgotPasswordUseCase } from '../forgot-password'
import { PrismaUserTokensRepository } from '@/respositories/prisma/prisma-user-tokens-repository'

export function makeForgotPasswordUseCase() {
  const prismaUsersRepository = new PrismaUsersRepository()
  const prismaUserTokensRepository = new PrismaUserTokensRepository()
  const useCase = new ForgotPasswordUseCase(
    prismaUsersRepository,
    prismaUserTokensRepository,
  )

  return useCase
}

import { PrismaUsersRepository } from '@/respositories/prisma/prisma-users-repository'
import { PrismaUserTokensRepository } from '@/respositories/prisma/prisma-user-tokens-repository'
import { ResetPasswordUseCase } from '../reset-password'

export function makeResetPasswordUseCase() {
  const prismaUsersRepository = new PrismaUsersRepository()
  const prismaUserTokensRepository = new PrismaUserTokensRepository()
  const useCase = new ResetPasswordUseCase(
    prismaUsersRepository,
    prismaUserTokensRepository,
  )

  return useCase
}

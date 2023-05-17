import { PrismaUsersRepository } from '@/respositories/prisma/prisma-users-repository'
import { PrismaUserTokensRepository } from '@/respositories/prisma/prisma-user-tokens-repository'
import { ResendVerificationUseCase } from '../resend-verification'

export function makeResendVerificationUseCase() {
  const prismaUsersRepository = new PrismaUsersRepository()
  const prismaUserTokensRepository = new PrismaUserTokensRepository()
  const useCase = new ResendVerificationUseCase(
    prismaUsersRepository,
    prismaUserTokensRepository,
  )

  return useCase
}

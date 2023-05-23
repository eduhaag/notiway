import { PrismaUsersRepository } from '@/respositories/prisma/prisma-users-repository'
import { PrismaUserTokensRepository } from '@/respositories/prisma/prisma-user-tokens-repository'
import { ResendVerificationUseCase } from '../resend-verification'
import { queuesProvider } from '@/app'

export function makeResendVerificationUseCase() {
  const prismaUsersRepository = new PrismaUsersRepository()
  const prismaUserTokensRepository = new PrismaUserTokensRepository()
  const useCase = new ResendVerificationUseCase(
    prismaUsersRepository,
    prismaUserTokensRepository,
    queuesProvider,
  )

  return useCase
}

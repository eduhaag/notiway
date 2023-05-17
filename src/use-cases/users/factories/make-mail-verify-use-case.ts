import { PrismaUsersRepository } from '@/respositories/prisma/prisma-users-repository'
import { MailVerifyUseCase } from '../mail-verify'
import { PrismaUserTokensRepository } from '@/respositories/prisma/prisma-user-tokens-repository'

export function makeMailVerifyUseCase() {
  const prismaUsersRepository = new PrismaUsersRepository()
  const prismaUserTokensRepository = new PrismaUserTokensRepository()
  const useCase = new MailVerifyUseCase(
    prismaUsersRepository,
    prismaUserTokensRepository,
  )

  return useCase
}

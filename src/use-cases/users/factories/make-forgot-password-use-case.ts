import { PrismaUsersRepository } from '@/respositories/prisma/prisma-users-repository'
import { ForgotPasswordUseCase } from '../forgot-password'
import { PrismaUserTokensRepository } from '@/respositories/prisma/prisma-user-tokens-repository'
import { EtherealMailProvider } from '@/providers/mail-provider/implementations/etherealMailProvider'

export function makeForgotPasswordUseCase() {
  const prismaUsersRepository = new PrismaUsersRepository()
  const prismaUserTokensRepository = new PrismaUserTokensRepository()
  const mailProvider = new EtherealMailProvider()
  const useCase = new ForgotPasswordUseCase(
    prismaUsersRepository,
    prismaUserTokensRepository,
    mailProvider,
  )

  return useCase
}

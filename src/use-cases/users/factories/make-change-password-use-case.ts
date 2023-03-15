import { PrismaUsersRepository } from '@/respositories/prisma/prisma-users-repository'
import { ChangePasswordUseCase } from '../change-password'

export function makeChangePasswordUseCase() {
  const prismaUsersRepository = new PrismaUsersRepository()
  const changePasswordUseCase = new ChangePasswordUseCase(prismaUsersRepository)

  return changePasswordUseCase
}

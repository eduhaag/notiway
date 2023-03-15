import { PrismaUsersRepository } from '@/respositories/prisma/prisma-users-repository'
import { UpdateUserUseCase } from '../update'

export function makeUpdateUserUseCase() {
  const prismaUsersRepository = new PrismaUsersRepository()
  const updateUserUseCse = new UpdateUserUseCase(prismaUsersRepository)

  return updateUserUseCse
}

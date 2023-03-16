import { ProfileUseCase } from '../profile'
import { PrismaConsumersRepository } from '@/respositories/prisma/prisma-consumers-repository'

export function makeProfileUseCase() {
  const prismaConsumersRepository = new PrismaConsumersRepository()
  const profileUsersUseCase = new ProfileUseCase(prismaConsumersRepository)

  return profileUsersUseCase
}

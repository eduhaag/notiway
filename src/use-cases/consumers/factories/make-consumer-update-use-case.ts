import { UpdateConsumerUseCase } from '../update'
import { PrismaConsumersRepository } from '@/respositories/prisma/prisma-consumers-repository'

export function makeConsumerUpdateUseCase() {
  const prismaConsumersRepository = new PrismaConsumersRepository()
  const updateUseCase = new UpdateConsumerUseCase(prismaConsumersRepository)

  return updateUseCase
}

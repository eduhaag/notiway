import { PrismaSendersRepository } from '@/respositories/prisma/prisma-senders-repository'
import { CreateSenderUseCase } from '../create'
import { PrismaConsumersRepository } from '@/respositories/prisma/prisma-consumers-repository'

export function makeCreateSenderUseCase() {
  const sendersRepository = new PrismaSendersRepository()
  const consumersRepository = new PrismaConsumersRepository()

  const useCase = new CreateSenderUseCase(
    sendersRepository,
    consumersRepository,
  )

  return useCase
}

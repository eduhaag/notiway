import { PrismaSendersRepository } from '@/respositories/prisma/prisma-senders-repository'
import { PrismaConsumersRepository } from '@/respositories/prisma/prisma-consumers-repository'
import { UpdateSenderUseCase } from '../update'

export function makeUpdateSenderUseCase() {
  const sendersRepository = new PrismaSendersRepository()
  const consumersRepository = new PrismaConsumersRepository()

  const useCase = new UpdateSenderUseCase(
    sendersRepository,
    consumersRepository,
  )

  return useCase
}

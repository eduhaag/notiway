import { InMemoryConsumersRepository } from '@/respositories/in-memory/in-memory-consumers-repository'
import { UpdateConsumerUseCase } from '../update'

export function makeConsumerUpdateUseCase() {
  const prismaConsumersRepository = new InMemoryConsumersRepository()
  const updateUseCase = new UpdateConsumerUseCase(prismaConsumersRepository)

  return updateUseCase
}

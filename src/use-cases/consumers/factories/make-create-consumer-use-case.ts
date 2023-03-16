import { InMemoryConsumersRepository } from '@/respositories/in-memory/in-memory-consumers-repository'
import { CreateConsumerUseCase } from '../create'

export function makeCreateConsumerUseCase() {
  const prismaConsumersRepository = new InMemoryConsumersRepository()
  const createUsersUseCase = new CreateConsumerUseCase(
    prismaConsumersRepository,
  )

  return createUsersUseCase
}

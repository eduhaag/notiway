import { FetchConsumersUseCase } from '../fetch'
import { InMemoryConsumersRepository } from '@/respositories/in-memory/in-memory-consumers-repository'

export function makeFetchConsumersUseCase() {
  const prismaConsumersRepository = new InMemoryConsumersRepository()
  const fetchUsersUseCase = new FetchConsumersUseCase(prismaConsumersRepository)

  return fetchUsersUseCase
}

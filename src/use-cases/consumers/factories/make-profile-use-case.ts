import { InMemoryConsumersRepository } from '@/respositories/in-memory/in-memory-consumers-repository'
import { ProfileUseCase } from '../profile'

export function makeProfileUseCase() {
  const prismaConsumersRepository = new InMemoryConsumersRepository()
  const profileUsersUseCase = new ProfileUseCase(prismaConsumersRepository)

  return profileUsersUseCase
}

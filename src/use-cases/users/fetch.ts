import { UsersRepository } from '@/respositories/users-repository'
import { User } from '@prisma/client'

interface FetchUsersUseCaseRequest {
  accessLevel?: number
}

interface FetchUsersUseCaseResponse {
  users: User[]
}

export class FetchUsersUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    accessLevel,
  }: FetchUsersUseCaseRequest): Promise<FetchUsersUseCaseResponse> {
    const response = await this.usersRepository.getAll(accessLevel)

    const users = response.map((item) => {
      return { ...item, password_hash: 'omited' }
    })

    return { users }
  }
}

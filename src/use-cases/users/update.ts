import { UsersRepository } from '@/respositories/users-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found'
import { EmailAlreadyUsedError } from '../errors/email-already-used-error'

interface UpdateUserUseCaseRequest {
  userId: string
  email?: string
  accessLevel?: number
}

export class UpdateUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
    email,
    accessLevel = 10,
  }: UpdateUserUseCaseRequest): Promise<void> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    if (email && email !== user.email) {
      const checkEmailExists = await this.usersRepository.findByEmail(email)

      if (checkEmailExists) {
        throw new EmailAlreadyUsedError()
      }
    }

    user.access_level = accessLevel ?? user.access_level
    user.email = email ?? user.email

    await this.usersRepository.save(user)
  }
}

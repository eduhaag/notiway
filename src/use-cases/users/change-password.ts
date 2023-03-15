import { UsersRepository } from '@/respositories/users-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found'
import { compare, hash } from 'bcryptjs'
import { WrongOldPasswordError } from '../errors/wrong-old-password-error'

interface ChangePasswordUseCaseRequest {
  userId: string
  oldPassword: string
  newPassword: string
}

export class ChangePasswordUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
    newPassword,
    oldPassword,
  }: ChangePasswordUseCaseRequest): Promise<void> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const isPasswordCorrect = await compare(oldPassword, user.password_hash)

    if (!isPasswordCorrect) {
      throw new WrongOldPasswordError()
    }

    const newPasswordHashed = await hash(newPassword, 6)

    user.password_hash = newPasswordHashed

    await this.usersRepository.save(user)
  }
}

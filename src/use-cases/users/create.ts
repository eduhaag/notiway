import { UsersRepository } from '@/respositories/users-repository'
import { User } from '@prisma/client'
import { hash } from 'bcryptjs'
import { EmailAlreadyUsedError } from '../errors/email-already-used-error'

interface CreateUserUseCaseRequest {
  email: string
  password: string
  accessLevel?: number
}

interface CreateUserUseCaseResponse {
  user: User
}

export class CreateUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    password,
    accessLevel = 10,
  }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    const emailAlreadyExists = await this.usersRepository.findByEmail(email)

    if (emailAlreadyExists) {
      throw new EmailAlreadyUsedError()
    }

    const password_hash = await hash(password, 6)

    const user = await this.usersRepository.create({
      email,
      password_hash,
      access_level: accessLevel,
      mail_confirm_at: new Date(),
    })

    return { user }
  }
}

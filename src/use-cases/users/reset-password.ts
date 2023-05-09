import { UsersRepository } from '@/respositories/users-repository'
import { UserTokensRepository } from '@/respositories/user-tokens-repository'
import queue from '@/providers/queues/queue'
import path from 'path'
import { InvalidTokenError } from '../errors/invalid-token-error'
import { hash } from 'bcryptjs'
import dayjs from 'dayjs'

interface ResetPasswordUseCaseRequest {
  newPassword: string
  token: string
}

interface ResetPasswordUseCaseResponse {}

export class ResetPasswordUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private userTokensRepository: UserTokensRepository,
  ) {}

  async execute({
    token,
    newPassword,
  }: ResetPasswordUseCaseRequest): Promise<ResetPasswordUseCaseResponse> {
    const userToken = await this.userTokensRepository.findByToken(token)

    if (!userToken) {
      throw new InvalidTokenError()
    }

    const checkTokenIsExpired = dayjs().isAfter(userToken.expires_date)

    if (checkTokenIsExpired) {
      this.userTokensRepository.delete(userToken.token)
      throw new InvalidTokenError()
    }

    const newPasswordHashed = await hash(newPassword, 6)

    const { user } = userToken

    user.password_hash = newPasswordHashed

    await this.usersRepository.save({ ...user })
    await this.userTokensRepository.delete(token)

    const templatePath = path.resolve(
      __dirname,
      '..',
      '..',
      'views',
      'emails',
      'password-changed.hbs',
    )

    await queue.add('sendMail', {
      to: user.email,
      subject: 'Senha alterada',
      path: templatePath,
    })

    return {}
  }
}

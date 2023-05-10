import { UsersRepository } from '@/respositories/users-repository'
import { UserTokensRepository } from '@/respositories/user-tokens-repository'
import { InvalidTokenError } from '../errors/invalid-token-error'

interface MailVerifyUseCaseRequest {
  token: string
}

export class MailVerifyUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private userTokensRepository: UserTokensRepository,
  ) {}

  async execute({ token }: MailVerifyUseCaseRequest): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token)

    if (!userToken) {
      throw new InvalidTokenError()
    }

    if (userToken.type !== 'MAIL_CONFIRM') {
      throw new InvalidTokenError()
    }

    const user = await this.usersRepository.findById(userToken.user_id)

    user!.mail_confirm_at = new Date()

    await this.usersRepository.save(user!)
    await this.userTokensRepository.delete(token)
  }
}

import { UsersRepository } from '@/respositories/users-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found'
import { UserTokensRepository } from '@/respositories/user-tokens-repository'
import dayjs from 'dayjs'
import path from 'path'
import { queue } from '@/app'

interface ForgotPasswordUseCaseRequest {
  email: string
}

export class ForgotPasswordUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private userTokesRepository: UserTokensRepository,
  ) {}

  async execute({ email }: ForgotPasswordUseCaseRequest): Promise<void> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const expiresDate = dayjs().add(48, 'hour').toDate()

    const { token } = await this.userTokesRepository.create({
      user_id: user.id,
      expires_date: expiresDate,
      type: 'PASSWORD_RESET',
    })

    const templatePath = path.resolve(
      __dirname,
      '..',
      '..',
      'views',
      'emails',
      'forgot-password.hbs',
    )

    const mail = {
      to: email,
      subject: 'Notiway | Recuperação de senha',
      path: templatePath,
      variables: {
        mail: email,
        token,
      },
    }

    await queue.add({ data: mail, date: new Date(), queue: 'send-mail' })
  }
}

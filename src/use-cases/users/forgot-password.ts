import { UsersRepository } from '@/respositories/users-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found'
import { UserTokensRepository } from '@/respositories/user-tokens-repository'
import dayjs from 'dayjs'
import queue from '@/providers/queues/queue'
import path from 'path'

interface ForgotPasswordUseCaseRequest {
  email: string
}

interface ForgotPasswordUseCaseResponse {}

export class ForgotPasswordUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private userTokesRepository: UserTokensRepository,
  ) {}

  async execute({
    email,
  }: ForgotPasswordUseCaseRequest): Promise<ForgotPasswordUseCaseResponse> {
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

    await queue.add('sendMail', {
      to: email,
      subject: 'Notiway | Recuperação de senha',
      path: templatePath,
      variables: {
        mail: email,
        token,
      },
    })

    return {}
  }
}

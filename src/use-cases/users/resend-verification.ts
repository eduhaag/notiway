import { UsersRepository } from '@/respositories/users-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found'
import { UserTokensRepository } from '@/respositories/user-tokens-repository'
import queue from '@/providers/queues/queue'
import path from 'path'
import { EmailAlreadyValidatedError } from '../errors/email-already-valitadet-error'

interface ResendVerificationUseCaseRequest {
  email: string
}

export class ResendVerificationUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private userTokesRepository: UserTokensRepository,
  ) {}

  async execute({ email }: ResendVerificationUseCaseRequest): Promise<void> {
    const user = await this.usersRepository.findByEmail(email)
    console.log(1)
    if (!user) {
      console.log(2)
      throw new ResourceNotFoundError()
    }
    console.log(3)
    if (user.mail_confirm_at) {
      console.log(4)
      throw new EmailAlreadyValidatedError()
    }

    const userToken = (
      await this.userTokesRepository.findByUserId(user.id)
    ).find((userToken) => userToken.type === 'MAIL_CONFIRM')

    if (!userToken) {
      throw new ResourceNotFoundError()
    }

    const { token } = userToken

    const templatePath = path.resolve(
      __dirname,
      '..',
      '..',
      'views',
      'emails',
      'mail-verify.hbs',
    )

    await queue.add('sendMail', {
      to: email,
      from: 'atendimento@notiway.com.br',
      subject: 'Notiway | Verificação de E-mail',
      path: templatePath,
      variables: {
        token,
      },
    })
  }
}

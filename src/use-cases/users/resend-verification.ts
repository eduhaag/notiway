import { UsersRepository } from '@/respositories/users-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found'
import { UserTokensRepository } from '@/respositories/user-tokens-repository'
import path from 'path'
import { EmailAlreadyValidatedError } from '../errors/email-already-valitadet-error'
import { QueuesProvider } from '@/providers/queues-provider'

interface ResendVerificationUseCaseRequest {
  email: string
}

export class ResendVerificationUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private userTokesRepository: UserTokensRepository,
    private queuesProvider: QueuesProvider,
  ) {}

  async execute({ email }: ResendVerificationUseCaseRequest): Promise<void> {
    const user = await this.usersRepository.findByEmail(email)
    if (!user) {
      throw new ResourceNotFoundError()
    }
    if (user.mail_confirm_at) {
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

    const mail = {
      to: email,
      from: 'atendimento@notiway.com.br',
      subject: 'Notiway | Verificação de E-mail',
      path: templatePath,
      variables: {
        token,
      },
    }

    await this.queuesProvider.add({
      data: mail,
      date: new Date(),
      queue: 'send-mail',
    })
  }
}

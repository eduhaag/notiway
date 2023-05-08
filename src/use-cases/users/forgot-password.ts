import { UsersRepository } from '@/respositories/users-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found'
import { UserTokensRepository } from '@/respositories/user-tokens-repository'
import dayjs from 'dayjs'
import queue from '@/providers/queues/queue'

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

    const expiresDate = dayjs().add(3, 'hour').toDate()

    const { token } = await this.userTokesRepository.create({
      user_id: user.id,
      expires_date: expiresDate,
    })

    await queue.add('SendMail', {
      to: email,
      subject: 'Recuperação de senha',
      body: `O link para o reset é ${token}`,
    })

    return {}
  }
}

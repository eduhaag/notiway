import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/respositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { InMemoryUserTokensRepository } from '@/respositories/in-memory/in-memory-user-tokens-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found'
import { ResendVerificationUseCase } from './resend-verification'
import { EmailAlreadyValidatedError } from '../errors/email-already-valitadet-error'
import { queuesProviderMock } from '@/utils/test/mocks/queues-mock'

let usersRepository: InMemoryUsersRepository
let userTokensRepository: InMemoryUserTokensRepository
let sut: ResendVerificationUseCase

const queuesProvider = queuesProviderMock()

describe('Resend verification mail use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    userTokensRepository = new InMemoryUserTokensRepository()
    sut = new ResendVerificationUseCase(
      usersRepository,
      userTokensRepository,
      queuesProvider.queuesProvider,
    )
  })

  it('should be able to resend verification mail', async () => {
    const user = await usersRepository.create({
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    })

    await userTokensRepository.create({
      type: 'MAIL_CONFIRM',
      user_id: user.id,
    })

    await sut.execute({
      email: 'johndoe@example.com',
    })

    expect(queuesProvider.mocks.addMock).toBeCalledTimes(1)
  })

  it('should not be able to resend verification for a non-existing mail', async () => {
    expect(async () => {
      await sut.execute({
        email: 'johndoe@example.com',
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to resend verification mail for a non-exiting-token', async () => {
    await usersRepository.create({
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    })

    expect(async () => {
      await sut.execute({
        email: 'johndoe@example.com',
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to resend verification mail for verified mail', async () => {
    await usersRepository.create({
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
      mail_confirm_at: new Date(),
    })

    expect(async () => {
      await sut.execute({
        email: 'johndoe@example.com',
      })
    }).rejects.toBeInstanceOf(EmailAlreadyValidatedError)
  })
})

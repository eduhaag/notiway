import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/respositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { ForgotPasswordUseCase } from './forgot-password'
import { InMemoryUserTokensRepository } from '@/respositories/in-memory/in-memory-user-tokens-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found'
import { queuesProviderMock } from '@/utils/test/mocks/queues-mock'

let usersRepository: InMemoryUsersRepository
let userTokensRepository: InMemoryUserTokensRepository
let sut: ForgotPasswordUseCase

const { queuesProvider, mocks } = queuesProviderMock()

describe('Forgot Password use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    userTokensRepository = new InMemoryUserTokensRepository()
    sut = new ForgotPasswordUseCase(
      usersRepository,
      userTokensRepository,
      queuesProvider,
    )
  })

  it('should be able send a forgot password mail', async () => {
    const user = await usersRepository.create({
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    })

    await sut.execute({
      email: 'johndoe@example.com',
    })

    const token = userTokensRepository.userTokens.find(
      (token) => token.user_id === user.id,
    )

    expect(token).toBeTruthy()
    expect(mocks.addMock).toBeCalledTimes(1)
  })

  it('should not be able to send forgot password to a non-existing mail', async () => {
    expect(async () => {
      await sut.execute({
        email: 'johndoe@example.com',
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryUsersRepository } from '@/respositories/in-memory/in-memory-users-repository'
import { compare } from 'bcryptjs'
import { InMemoryUserTokensRepository } from '@/respositories/in-memory/in-memory-user-tokens-repository'
import queue from '@/providers/queues/queue'
import { ResetPasswordUseCase } from './reset-password'
import { InvalidTokenError } from '../errors/invalid-token-error'

let usersRepository: InMemoryUsersRepository
let userTokensRepository: InMemoryUserTokensRepository
let sut: ResetPasswordUseCase

const addToQueue = vi.spyOn(queue, 'add')

describe('Authenticate use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    userTokensRepository = new InMemoryUserTokensRepository(usersRepository)
    sut = new ResetPasswordUseCase(usersRepository, userTokensRepository)
  })

  it('should be able reset password', async () => {
    const user = await usersRepository.create({
      email: 'johndoe@example.com',
      password_hash: '123345',
    })

    const { token } = await userTokensRepository.create({
      user_id: user.id,
      expires_date: new Date(),
    })

    await sut.execute({
      newPassword: 'abcdef',
      token,
    })

    const userChanged = await usersRepository.findById(user.id)

    const passwordMatch = await compare('abcdef', userChanged!.password_hash)

    const thereToken = await userTokensRepository.findByToken(token)

    expect(passwordMatch).toBe(true)
    expect(thereToken).toBe(null)
    expect(addToQueue).toBeCalledTimes(1)
  })

  it('should not be able to reset password of a non-existing mail', async () => {
    expect(async () => {
      await sut.execute({
        newPassword: '123456',
        token: 'fake-token',
      })
    }).rejects.toBeInstanceOf(InvalidTokenError)
  })
})

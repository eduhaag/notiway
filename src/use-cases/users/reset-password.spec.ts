import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import { InMemoryUsersRepository } from '@/respositories/in-memory/in-memory-users-repository'
import { compare } from 'bcryptjs'
import { InMemoryUserTokensRepository } from '@/respositories/in-memory/in-memory-user-tokens-repository'
import { ResetPasswordUseCase } from './reset-password'
import { InvalidTokenError } from '../errors/invalid-token-error'

let usersRepository: InMemoryUsersRepository
let userTokensRepository: InMemoryUserTokensRepository
let sut: ResetPasswordUseCase

describe('Reset password use case', () => {
  beforeAll(() => {
    vi.useFakeTimers()
  })

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    userTokensRepository = new InMemoryUserTokensRepository(usersRepository)
    sut = new ResetPasswordUseCase(usersRepository, userTokensRepository)
  })

  afterAll(() => {
    vi.useRealTimers()
  })

  it('should be able reset password', async () => {
    const user = await usersRepository.create({
      email: 'johndoe@example.com',
      password_hash: '123345',
    })

    vi.setSystemTime(new Date(2100, 5, 1, 0, 0, 0))
    const { token } = await userTokensRepository.create({
      user_id: user.id,
      expires_date: new Date(),
      type: 'PASSWORD_RESET',
    })

    vi.setSystemTime(new Date(2023, 5, 1, 0, 0, 0))

    await sut.execute({
      newPassword: 'abcdef',
      token,
    })

    const userChanged = await usersRepository.findById(user.id)

    const passwordMatch = await compare('abcdef', userChanged!.password_hash)

    const thereToken = await userTokensRepository.findByToken(token)

    expect(passwordMatch).toBe(true)
    expect(thereToken).toBe(null)
  })

  it('should not be able to reset password with a invalid token', async () => {
    expect(async () => {
      await sut.execute({
        newPassword: '123456',
        token: 'fake-token',
      })
    }).rejects.toBeInstanceOf(InvalidTokenError)

    const user = await usersRepository.create({
      email: 'johndoe@example.com',
      password_hash: '123345',
    })

    const { token } = await userTokensRepository.create({
      user_id: user.id,
      expires_date: new Date(),
      type: 'MAIL_CONFIRM',
    })

    expect(async () => {
      await sut.execute({
        newPassword: '123456',
        token,
      })
    }).rejects.toBeInstanceOf(InvalidTokenError)
  })

  it('should not be able to reset password with a expired token', async () => {
    const user = await usersRepository.create({
      email: 'johndoe@example.com',
      password_hash: '123345',
    })

    vi.setSystemTime(new Date(2023, 5, 1, 0, 0, 0))
    const { token } = await userTokensRepository.create({
      user_id: user.id,
      expires_date: new Date(),
      type: 'PASSWORD_RESET',
    })

    vi.setSystemTime(new Date(2023, 5, 1, 0, 0, 1))

    expect(async () => {
      await sut.execute({
        newPassword: '123456',
        token,
      })
    }).rejects.toBeInstanceOf(InvalidTokenError)
  })
})

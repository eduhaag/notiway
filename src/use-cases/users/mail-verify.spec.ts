import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/respositories/in-memory/in-memory-users-repository'
import { InMemoryUserTokensRepository } from '@/respositories/in-memory/in-memory-user-tokens-repository'
import { InvalidTokenError } from '../errors/invalid-token-error'
import { MailVerifyUseCase } from './mail-verify'

let usersRepository: InMemoryUsersRepository
let userTokensRepository: InMemoryUserTokensRepository
let sut: MailVerifyUseCase

describe('Mail verify use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    userTokensRepository = new InMemoryUserTokensRepository(usersRepository)
    sut = new MailVerifyUseCase(usersRepository, userTokensRepository)
  })

  it('should be able to verify a email', async () => {
    const user = await usersRepository.create({
      email: 'johndoe@example.com',
      password_hash: '123345',
    })

    const { token } = await userTokensRepository.create({
      user_id: user.id,
      expires_date: new Date(),
      type: 'MAIL_CONFIRM',
    })

    await sut.execute({
      token,
    })

    const userChanged = await usersRepository.findById(user.id)

    const thereToken = await userTokensRepository.findByToken(token)

    expect(userChanged?.mail_confirm_at).toEqual(expect.any(Date))
    expect(thereToken).toBe(null)
  })

  it('should not be able to verify a email with a invalid token', async () => {
    expect(async () => {
      await sut.execute({
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
      type: 'PASSWORD_RESET',
    })

    expect(async () => {
      await sut.execute({
        token,
      })
    }).rejects.toBeInstanceOf(InvalidTokenError)
  })
})

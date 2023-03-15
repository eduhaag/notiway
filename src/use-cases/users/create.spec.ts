import { InMemoryUsersRepository } from '@/respositories/in-memory/in-memory-users-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateUserUseCase } from './create'
import { EmailAlreadyUsedError } from './errors/email-already-used-error'
import { compare } from 'bcryptjs'

let usersRepository: InMemoryUsersRepository
let sut: CreateUserUseCase

describe('Create user use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new CreateUserUseCase(usersRepository)
  })

  it('should be able to create a new user', async () => {
    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
      accessLevel: 50,
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('shoud not be able to create two user with the same email', async () => {
    await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(async () => {
      await sut.execute({
        email: 'johndoe@example.com',
        password: '123456',
      })
    }).rejects.toBeInstanceOf(EmailAlreadyUsedError)
  })

  it('should hash user password upon create', async () => {
    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should user access level to be 10', async () => {
    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(user.access_level).toBe(10)
  })
})

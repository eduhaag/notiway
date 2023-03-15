import { InMemoryUsersRepository } from '@/respositories/in-memory/in-memory-users-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { ResourceNotFoundError } from '../errors/resource-not-found'
import { ChangePasswordUseCase } from './change-password'
import { compare, hash } from 'bcryptjs'
import { WrongOldPasswordError } from '../errors/wrong-old-password-error'

let usersRepository: InMemoryUsersRepository
let sut: ChangePasswordUseCase

describe('Change user password use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new ChangePasswordUseCase(usersRepository)
  })

  it('should be able to change the password', async () => {
    const user = await usersRepository.create({
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    })

    await sut.execute({
      userId: user.id,
      oldPassword: '123456',
      newPassword: 'abcdef',
    })

    const userUpdated = await usersRepository.findById(user.id)

    const isPasswordChanged = await compare(
      'abcdef',
      userUpdated!.password_hash,
    )

    expect(isPasswordChanged).toBe(true)
  })

  it('shoud not be able to change password with a non-existing user ID', async () => {
    expect(async () => {
      await sut.execute({
        userId: 'non-exisiting-user-id',
        oldPassword: '123456',
        newPassword: 'abcdef',
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('shoud not be able to change password with a incorrec old password', async () => {
    const user = await usersRepository.create({
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    })

    expect(async () => {
      await sut.execute({
        userId: user.id,
        oldPassword: 'wrong-password',
        newPassword: 'abcdef',
      })
    }).rejects.toBeInstanceOf(WrongOldPasswordError)
  })
})

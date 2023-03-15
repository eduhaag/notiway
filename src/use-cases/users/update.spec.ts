import { InMemoryUsersRepository } from '@/respositories/in-memory/in-memory-users-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { UpdateUserUseCase } from './update'
import { ResourceNotFoundError } from '../errors/resource-not-found'
import { EmailAlreadyUsedError } from '../errors/email-already-used-error'

let usersRepository: InMemoryUsersRepository
let sut: UpdateUserUseCase

describe('Update user use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new UpdateUserUseCase(usersRepository)
  })

  it('should be able to update user', async () => {
    const user = await usersRepository.create({
      email: 'johndoe@example.com',
      password_hash: '123456',
    })

    await sut.execute({ userId: user.id, accessLevel: 50 })

    const userUpdated = await usersRepository.findById(user.id)

    expect(userUpdated?.access_level).toBe(50)
  })

  it('shoud not be able to updtate with a non-existing user ID', async () => {
    expect(async () => {
      await sut.execute({
        userId: 'non-exisiting-user-id',
        accessLevel: 50,
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('shoud not be able to updtate email to an existing-email', async () => {
    await usersRepository.create({
      email: 'johndoe@example.com',
      password_hash: '123456',
    })

    const userToUpdate = await usersRepository.create({
      email: 'example@example.com',
      password_hash: '123456',
    })

    expect(async () => {
      await sut.execute({
        userId: userToUpdate.id,
        email: 'johndoe@example.com',
      })
    }).rejects.toBeInstanceOf(EmailAlreadyUsedError)
  })
})

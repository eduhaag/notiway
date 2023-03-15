import { InMemoryUsersRepository } from '@/respositories/in-memory/in-memory-users-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchUsersUseCase } from './fetch'

let usersRepository: InMemoryUsersRepository
let sut: FetchUsersUseCase

describe('Fetch user use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new FetchUsersUseCase(usersRepository)

    usersRepository.create({
      email: 'johndoe@example.com',
      password_hash: '123456',
    })

    usersRepository.create({
      email: 'mariedoe@example.com',
      password_hash: '123456',
    })
  })

  it('should be able to list all users', async () => {
    const { users } = await sut.execute()

    expect(users).toHaveLength(2)
    expect(users).toEqual([
      expect.objectContaining({ email: 'johndoe@example.com' }),
      expect.objectContaining({ email: 'mariedoe@example.com' }),
    ])
  })

  it('should be able to omit the password hash', async () => {
    const { users } = await sut.execute()

    expect(users).toEqual([
      expect.objectContaining({ password_hash: 'omited' }),
      expect.objectContaining({ password_hash: 'omited' }),
    ])
  })
})

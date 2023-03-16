import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryConsumersRepository } from '@/respositories/in-memory/in-memory-consumers-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found'
import { ProfileUseCase } from './profile'

let consumersRepository: InMemoryConsumersRepository
let sut: ProfileUseCase

describe('Get consumer profile use case', () => {
  beforeEach(() => {
    consumersRepository = new InMemoryConsumersRepository()
    sut = new ProfileUseCase(consumersRepository)
  })

  it('should be able to get a consumer profile', async () => {
    const { id } = await consumersRepository.create({
      email: 'johndoe@example.com',
      name: 'John Doe',
    })

    const { consumer } = await sut.execute({ consumerId: id })

    expect(consumer).toEqual(
      expect.objectContaining({
        email: 'johndoe@example.com',
        name: 'John Doe',
      }),
    )
  })

  it('shoud not be able to get a non-existing-consumer', async () => {
    expect(async () => {
      await sut.execute({
        consumerId: 'non-existing-consumer-id',
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})

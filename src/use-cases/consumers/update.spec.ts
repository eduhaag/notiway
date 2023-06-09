import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryConsumersRepository } from '@/respositories/in-memory/in-memory-consumers-repository'
import { UpdateConsumerUseCase } from './update'
import { ResourceNotFoundError } from '../errors/resource-not-found'

let consumersRepository: InMemoryConsumersRepository
let sut: UpdateConsumerUseCase

describe('Update consumer use case', () => {
  beforeEach(() => {
    consumersRepository = new InMemoryConsumersRepository()
    sut = new UpdateConsumerUseCase(consumersRepository)
  })

  it('should be able to update a consumer', async () => {
    const consumer = await consumersRepository.create({
      email: 'johndoe@example.com',
      name: 'John Doe',
    })

    await sut.execute({ id: consumer.id, acceptMarketing: true })

    const response = await consumersRepository.findById(consumer.id)

    expect(response?.marketing_agree_at).toEqual(expect.any(Date))
  })

  it('shoud not be able to to update a non existing consumer', async () => {
    expect(async () => {
      await sut.execute({
        id: 'non-existing-consumer-id',
        acceptMarketing: true,
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})

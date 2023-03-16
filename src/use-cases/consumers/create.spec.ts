import { beforeEach, describe, expect, it } from 'vitest'
import { EmailAlreadyUsedError } from '../errors/email-already-used-error'
import { CreateConsumerUseCase } from './create'
import { InMemoryConsumersRepository } from '@/respositories/in-memory/in-memory-consumers-repository'
import { TaxIdAlreadyExistsError } from '../errors/tax-id-already-exists-error'

let consumersRepository: InMemoryConsumersRepository
let sut: CreateConsumerUseCase

describe('Create consumer use case', () => {
  beforeEach(() => {
    consumersRepository = new InMemoryConsumersRepository()
    sut = new CreateConsumerUseCase(consumersRepository)
  })

  it('should be able to create a new consumer', async () => {
    const { consumer } = await sut.execute({
      email: 'johndoe@example.com',
      name: 'John Doe',
      password: '123456',
    })

    console.log(consumersRepository.consumers)

    expect(consumer.id).toEqual(expect.any(String))
  })

  it('shoud not be able to create two user with the same email', async () => {
    await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(async () => {
      await sut.execute({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
      })
    }).rejects.toBeInstanceOf(EmailAlreadyUsedError)
  })

  it('shoud not be able to create two user with the same tax id', async () => {
    await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      tax_id: '999.999.999-99',
    })

    expect(async () => {
      await sut.execute({
        name: 'Marie Doe',
        email: 'mariedoe@example.com',
        password: '123456',
        tax_id: '999.999.999-99',
      })
    }).rejects.toBeInstanceOf(TaxIdAlreadyExistsError)
  })
})

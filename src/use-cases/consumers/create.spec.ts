import { beforeEach, describe, expect, it } from 'vitest'
import { EmailAlreadyUsedError } from '../errors/email-already-used-error'
import { CreateConsumerUseCase } from './create'
import { InMemoryConsumersRepository } from '@/respositories/in-memory/in-memory-consumers-repository'
import { TaxIdAlreadyExistsError } from '../errors/tax-id-already-exists-error'
import { InMemoryUserTokensRepository } from '@/respositories/in-memory/in-memory-user-tokens-repository'
import { InMemoryUsersRepository } from '@/respositories/in-memory/in-memory-users-repository'
import { queuesProviderMock } from '@/utils/test/mocks/queues-mock'

let consumersRepository: InMemoryConsumersRepository
let usersRepository: InMemoryUsersRepository
let userTokensRepository: InMemoryUserTokensRepository
let sut: CreateConsumerUseCase

const queuesProvider = queuesProviderMock()

describe('Create consumer use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    consumersRepository = new InMemoryConsumersRepository(usersRepository)
    userTokensRepository = new InMemoryUserTokensRepository()
    sut = new CreateConsumerUseCase(
      consumersRepository,
      usersRepository,
      userTokensRepository,
      queuesProvider.queuesProvider,
    )
  })

  it('should be able to create a new consumer', async () => {
    const { consumer } = await sut.execute({
      email: 'johndoe@example.com',
      name: 'John Doe',
      password: '123456',
      privacityTermsAgree: true,
    })

    expect(consumer.id).toEqual(expect.any(String))
    expect(queuesProvider.mocks.addMock).toBeCalledTimes(1)
  })

  it('shoud not be able to create two user with the same email', async () => {
    await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      privacityTermsAgree: true,
    })

    expect(async () => {
      await sut.execute({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
        privacityTermsAgree: true,
      })
    }).rejects.toBeInstanceOf(EmailAlreadyUsedError)
  })

  it('shoud not be able to create two user with the same tax id', async () => {
    await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      tax_id: '999.999.999-99',
      privacityTermsAgree: true,
    })

    expect(async () => {
      await sut.execute({
        name: 'Marie Doe',
        email: 'mariedoe@example.com',
        password: '123456',
        tax_id: '999.999.999-99',
        privacityTermsAgree: true,
      })
    }).rejects.toBeInstanceOf(TaxIdAlreadyExistsError)
  })
})

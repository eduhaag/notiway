import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryConsumersRepository } from '@/respositories/in-memory/in-memory-consumers-repository'
import { CreateClientUseCase } from './create'
import { InMemoryClientsRepository } from '@/respositories/in-memory/in-memory-clients-repository'
import { InMemorySenderRepository } from '@/respositories/in-memory/in-memory-senders-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found'
import { InMemoryClientTokensRepository } from '@/respositories/in-memory/in-memory-client-tokens-repository'

let clientsRepository: InMemoryClientsRepository
let sendersRepository: InMemorySenderRepository
let consumersRepository: InMemoryConsumersRepository
let clientTokensRepository: InMemoryClientTokensRepository
let sut: CreateClientUseCase

describe('Create client use case', () => {
  beforeEach(() => {
    consumersRepository = new InMemoryConsumersRepository()
    clientsRepository = new InMemoryClientsRepository()
    sendersRepository = new InMemorySenderRepository()
    clientTokensRepository = new InMemoryClientTokensRepository()
    sut = new CreateClientUseCase(
      clientsRepository,
      consumersRepository,
      sendersRepository,
      clientTokensRepository,
    )
  })

  it('should be able to create a new client', async () => {
    const consumer = await consumersRepository.create({
      email: 'johndoe@example.com',
      name: 'John Doe',
    })
    const { client } = await sut.execute({
      consumer_id: consumer.id,
      name: 'client-example',
    })

    expect(client.id).toEqual(expect.any(String))
  })

  it('should be able to create token together the client', async () => {
    const consumer = await consumersRepository.create({
      email: 'johndoe@example.com',
      name: 'John Doe',
    })
    const { token } = await sut.execute({
      consumer_id: consumer.id,
      name: 'client-example',
    })

    expect(token).toEqual(expect.any(String))
  })

  it('should not be able to create a new client with a non-existing consumer Id', async () => {
    expect(async () => {
      await sut.execute({
        consumer_id: 'non-existing-consumer-id',
        name: 'client-example',
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to create a new client with a non-existing sender', async () => {
    const consumer = await consumersRepository.create({
      email: 'johndoe@example.com',
      name: 'John Doe',
    })

    expect(async () => {
      await sut.execute({
        consumer_id: consumer.id,
        name: 'client-example',
        sender_id: 'non-existing-sender-id',
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})

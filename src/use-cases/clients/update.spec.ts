import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryClientsRepository } from '@/respositories/in-memory/in-memory-clients-repository'
import { InMemorySenderRepository } from '@/respositories/in-memory/in-memory-senders-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found'
import { UpdateClientUseCase } from './update'

let clientsRepository: InMemoryClientsRepository
let sendersRepository: InMemorySenderRepository
let sut: UpdateClientUseCase

describe('Update client use case', () => {
  beforeEach(() => {
    clientsRepository = new InMemoryClientsRepository()
    sendersRepository = new InMemorySenderRepository()
    sut = new UpdateClientUseCase(clientsRepository, sendersRepository)
  })

  it('should be able to update a client', async () => {
    const client = await clientsRepository.create({
      consumer_id: 'example-consumer-id',
      name: 'client-example',
    })

    await sut.execute({ id: client.id, status: 'updated' })

    const clientUpdated = await clientsRepository.findById(client.id)

    expect(clientUpdated?.status).toEqual('updated')
  })

  it('should not be able to update a non-existing-client', async () => {
    expect(async () => {
      await sut.execute({
        id: 'non-existing-client-id',
        status: 'updated',
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to update a client with a non-existing sender', async () => {
    const client = await clientsRepository.create({
      consumer_id: 'example-consumer-id',
      name: 'example-client-name',
    })

    expect(async () => {
      await sut.execute({
        id: client.id,
        sender_id: 'non-existing-sender-id',
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})

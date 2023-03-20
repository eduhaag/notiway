import { beforeEach, describe, expect, it } from 'vitest'
import { FetchByConsumerIdUseCase } from './fetchByConsumerId'
import { InMemoryClientsRepository } from '@/respositories/in-memory/in-memory-clients-repository'

let clientsRepositository: InMemoryClientsRepository
let sut: FetchByConsumerIdUseCase

describe('Fetch clients by consumer use case', () => {
  beforeEach(() => {
    clientsRepositository = new InMemoryClientsRepository()
    sut = new FetchByConsumerIdUseCase(clientsRepositository)
  })

  it('should be able to fetch clients', async () => {
    await clientsRepositository.create({
      consumer_id: 'example-consumer-id',
      name: 'example-client-1',
    })

    await clientsRepositository.create({
      consumer_id: 'example-consumer-id',
      name: 'example-client-2',
    })

    const { clients } = await sut.execute({ consumerId: 'example-consumer-id' })

    expect(clients).toHaveLength(2)
    expect(clients).toEqual([
      expect.objectContaining({ name: 'example-client-1' }),
      expect.objectContaining({ name: 'example-client-2' }),
    ])
  })
})

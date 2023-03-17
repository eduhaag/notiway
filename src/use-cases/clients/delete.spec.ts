import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryClientsRepository } from '@/respositories/in-memory/in-memory-clients-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found'
import { InMemoryClientTokensRepository } from '@/respositories/in-memory/in-memory-client-tokens-repository'
import { DeleteUseCase } from './delete'

let clientsRepository: InMemoryClientsRepository
let clientTokensRepository: InMemoryClientTokensRepository
let sut: DeleteUseCase

describe('Delete client use case', () => {
  beforeEach(() => {
    clientsRepository = new InMemoryClientsRepository()
    clientTokensRepository = new InMemoryClientTokensRepository()
    sut = new DeleteUseCase(clientsRepository, clientTokensRepository)
  })

  it('should be able to delete a client', async () => {
    const client = await clientsRepository.create({
      consumer_id: 'example-consumer-id',
      name: 'client-example',
    })

    await clientTokensRepository.create({
      token: 'token',
      client_id: client.id,
    })

    await sut.execute({ clientId: client.id })

    const clientFinded = await clientsRepository.findById(client.id)

    expect(clientFinded).toEqual(null)
  })

  it('should be able to delete client token together the client', async () => {
    const client = await clientsRepository.create({
      consumer_id: 'example-consumer-id',
      name: 'client-example',
    })

    await clientTokensRepository.create({
      token: `token-${client.id}`,
      client_id: client.id,
    })

    await sut.execute({ clientId: client.id })

    const token = await clientTokensRepository.findByToken(`token-${client.id}`)

    expect(token).toEqual(null)
  })

  it('should not be able to delete a non-existing client Id', async () => {
    expect(async () => {
      await sut.execute({
        clientId: 'non-existing-consumer-id',
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})

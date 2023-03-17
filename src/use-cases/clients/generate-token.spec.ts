import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryClientsRepository } from '@/respositories/in-memory/in-memory-clients-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found'
import { InMemoryClientTokensRepository } from '@/respositories/in-memory/in-memory-client-tokens-repository'
import { GenerateTokenUseCase } from './generate-token'

let clientsRepository: InMemoryClientsRepository
let clientTokensRepository: InMemoryClientTokensRepository
let sut: GenerateTokenUseCase

describe('Generate token use case', () => {
  beforeEach(() => {
    clientsRepository = new InMemoryClientsRepository()
    clientTokensRepository = new InMemoryClientTokensRepository()
    sut = new GenerateTokenUseCase(clientsRepository, clientTokensRepository)
  })

  it('should be able to generate a new token', async () => {
    const client = await clientsRepository.create({
      consumer_id: 'example-consumer-id',
      name: 'client-example',
    })

    const { token } = await sut.execute({ clientId: client.id })

    expect(token).toEqual(expect.any(String))
  })

  it('should not be able to generate token with a non-existing client Id', async () => {
    expect(async () => {
      await sut.execute({
        clientId: 'non-existing-client-id',
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})

import { InMemoryClientTokensRepository } from '@/respositories/in-memory/in-memory-client-tokens-repository'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import queue from '@/queues/queue'
import { ClientNotAuthorizedError } from '../errors/client-not-authorized-error'
import { ClientNotReadyError } from '../errors/client-not-ready-error'
import { ClientSenderNotReadyError } from '../errors/client-sender-not-ready-error'
import { SendLocationUseCase } from './send-location'

let clientTokensRepository: InMemoryClientTokensRepository
let sut: SendLocationUseCase

const addToQueue = vi.spyOn(queue, 'add')

describe('Send location use case', () => {
  beforeEach(async () => {
    clientTokensRepository = new InMemoryClientTokensRepository()
    sut = new SendLocationUseCase(clientTokensRepository)

    await clientTokensRepository.createFakeClient({
      status: 'ready',
      id: 'clientId',
      footer: null,
      header: null,
      sender: {
        api_token: 'api-token-example',
        name: 'sender-name',
        paread_at: new Date(),
        disabled_at: null,
      },
    })

    await clientTokensRepository.create({
      client_id: 'clientId',
      token: 'token-example',
    })
  })

  it('should be able to send location message', async () => {
    await sut.execute({
      to: '9999999',
      token: 'token-example',
      latitude: -15.0453,
      longitude: -30.0029,
    })

    expect(addToQueue).toBeCalledTimes(1)
  })

  it('should not be able to send location message with a invalid token', async () => {
    expect(async () => {
      await sut.execute({
        latitude: -15.0453,
        longitude: -30.0029,
        to: '9999999',
        token: 'invalid-token',
      })
    }).rejects.toBeInstanceOf(ClientNotAuthorizedError)
  })

  it('should not be able to send location message with a client not ready', async () => {
    clientTokensRepository.client.status = 'processing'

    expect(async () => {
      await sut.execute({
        latitude: -15.0453,
        longitude: -30.0029,
        to: '9999999',
        token: 'token-example',
      })
    }).rejects.toBeInstanceOf(ClientNotReadyError)
  })

  it('should not be able to send location message with a client whithout sender', async () => {
    clientTokensRepository.client.sender = null

    expect(async () => {
      await sut.execute({
        latitude: -15.0453,
        longitude: -30.0029,
        to: '9999999',
        token: 'token-example',
      })
    }).rejects.toBeInstanceOf(ClientSenderNotReadyError)
  })

  it('should not be able to send location message with a client with sender not ready', async () => {
    clientTokensRepository.client.sender!.paread_at = null

    expect(async () => {
      await sut.execute({
        latitude: -15.0453,
        longitude: -30.0029,
        to: '9999999',
        token: 'token-example',
      })
    }).rejects.toBeInstanceOf(ClientSenderNotReadyError)
  })

  it('should not be able to send location message with a client with sender disabled', async () => {
    clientTokensRepository.client.sender!.disabled_at = new Date()

    expect(async () => {
      await sut.execute({
        latitude: -15.0453,
        longitude: -30.0029,
        to: '9999999',
        token: 'token-example',
      })
    }).rejects.toBeInstanceOf(ClientSenderNotReadyError)
  })
})

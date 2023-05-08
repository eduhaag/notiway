import { InMemoryClientTokensRepository } from '@/respositories/in-memory/in-memory-client-tokens-repository'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import queue from '@/providers/queues/queue'
import { ClientNotAuthorizedError } from '../errors/client-not-authorized-error'
import { ClientNotReadyError } from '../errors/client-not-ready-error'
import { ClientSenderNotReadyError } from '../errors/client-sender-not-ready-error'
import { SendContactUseCase } from './send-contact'

let clientTokensRepository: InMemoryClientTokensRepository
let sut: SendContactUseCase

const addToQueue = vi.spyOn(queue, 'add')

describe('Send contact use case', () => {
  beforeEach(async () => {
    clientTokensRepository = new InMemoryClientTokensRepository()
    sut = new SendContactUseCase(clientTokensRepository)

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

  it('should be able to send a contact message', async () => {
    await sut.execute({
      contact: '5547999999999',
      name: 'John Doe',
      to: '9999999',
      token: 'token-example',
    })

    expect(addToQueue).toBeCalledTimes(1)
  })

  it('should not be able to contact with a invalid token', async () => {
    expect(async () => {
      await sut.execute({
        contact: '5547999999999',
        name: 'John Doe',
        to: '9999999',
        token: 'invalid-token',
      })
    }).rejects.toBeInstanceOf(ClientNotAuthorizedError)
  })

  it('should not be able to send contact with a client not ready', async () => {
    clientTokensRepository.client.status = 'processing'

    expect(async () => {
      await sut.execute({
        contact: '5547999999999',
        name: 'John Doe',
        to: '9999999',
        token: 'token-example',
      })
    }).rejects.toBeInstanceOf(ClientNotReadyError)
  })

  it('should not be able to send contact with a client whithout sender', async () => {
    clientTokensRepository.client.sender = null

    expect(async () => {
      await sut.execute({
        contact: '5547999999999',
        name: 'John Doe',
        to: '9999999',
        token: 'token-example',
      })
    }).rejects.toBeInstanceOf(ClientSenderNotReadyError)
  })

  it('should not be able to send contact with a client with sender not ready', async () => {
    clientTokensRepository.client.sender!.paread_at = null

    expect(async () => {
      await sut.execute({
        contact: '5547999999999',
        name: 'John Doe',
        to: '9999999',
        token: 'token-example',
      })
    }).rejects.toBeInstanceOf(ClientSenderNotReadyError)
  })

  it('should not be able to send contact with a client with sender disabled', async () => {
    clientTokensRepository.client.sender!.disabled_at = new Date()

    expect(async () => {
      await sut.execute({
        contact: '5547999999999',
        name: 'John Doe',
        to: '9999999',
        token: 'token-example',
      })
    }).rejects.toBeInstanceOf(ClientSenderNotReadyError)
  })
})

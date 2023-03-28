import { InMemoryClientTokensRepository } from '@/respositories/in-memory/in-memory-client-tokens-repository'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import queue from '@/queues/queue'
import { ClientNotAuthorizedError } from '../errors/client-not-authorized-error'
import { ClientNotReadyError } from '../errors/client-not-ready-error'
import { ClientSenderNotReadyError } from '../errors/client-sender-not-ready-error'
import { SendFileUseCase } from './send-file'

let clientTokensRepository: InMemoryClientTokensRepository
let sut: SendFileUseCase

const addToQueue = vi.spyOn(queue, 'add')

describe('Send file use case', () => {
  beforeEach(async () => {
    clientTokensRepository = new InMemoryClientTokensRepository()
    sut = new SendFileUseCase(clientTokensRepository)

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

  it('should be able to send file', async () => {
    await sut.execute({
      to: '9999999',
      token: 'token-example',
      base64: 'base64-example',
      fileType: 'IMAGE',
    })

    expect(addToQueue).toBeCalledTimes(1)
  })

  it('should not be able to send file with a invalid token', async () => {
    expect(async () => {
      await sut.execute({
        to: '9999999',
        token: 'invalid-token',
        base64: 'base64-example',
        fileType: 'FILE',
      })
    }).rejects.toBeInstanceOf(ClientNotAuthorizedError)
  })

  it('should not be able to send file with a client not ready', async () => {
    clientTokensRepository.client.status = 'processing'

    expect(async () => {
      await sut.execute({
        base64: 'base64-example',
        to: '9999999',
        token: 'token-example',
        fileType: 'FILE',
      })
    }).rejects.toBeInstanceOf(ClientNotReadyError)
  })

  it('should not be able to send file with a client whithout sender', async () => {
    clientTokensRepository.client.sender = null

    expect(async () => {
      await sut.execute({
        base64: 'base64-example',
        to: '9999999',
        token: 'token-example',
        fileType: 'FILE',
      })
    }).rejects.toBeInstanceOf(ClientSenderNotReadyError)
  })

  it('should not be able to send file with a client with sender not ready', async () => {
    clientTokensRepository.client.sender!.paread_at = null

    expect(async () => {
      await sut.execute({
        base64: 'base64-example',
        to: '9999999',
        token: 'token-example',
        fileType: 'FILE',
      })
    }).rejects.toBeInstanceOf(ClientSenderNotReadyError)
  })

  it('should not be able to send file with a client with sender disabled', async () => {
    clientTokensRepository.client.sender!.disabled_at = new Date()

    expect(async () => {
      await sut.execute({
        base64: 'base64-example',
        to: '9999999',
        token: 'token-example',
        fileType: 'FILE',
      })
    }).rejects.toBeInstanceOf(ClientSenderNotReadyError)
  })
})

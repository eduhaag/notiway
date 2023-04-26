import { beforeEach, describe, expect, it } from 'vitest'
import { InMemorySenderRepository } from '@/respositories/in-memory/in-memory-senders-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found'
import { axiosPostMock } from '@/utils/test/mocks/axios-mock'
import { DisconnectSenderUseCase } from './disconnect'

let sendersRepository: InMemorySenderRepository
let sut: DisconnectSenderUseCase

axiosPostMock()

describe('Disconnect sender use case', () => {
  beforeEach(() => {
    sendersRepository = new InMemorySenderRepository()
    sut = new DisconnectSenderUseCase(sendersRepository)
  })

  it('should be able to disconnect a sender', async () => {
    const sender = await sendersRepository.create({
      api_token: 'api-token',
      full_number: '(99)99999-9999',
      name: 'sender 1',
      type: 'SHARED',
      paread_at: new Date(),
    })

    await sut.execute({
      senderId: sender.id,
    })

    const senderDisconnected = await sendersRepository.findById(sender.id)

    expect(senderDisconnected?.paread_at).toEqual(null)
  })

  it('should not be able to disconnect a non-existing sender', async () => {
    expect(async () => {
      await sut.execute({
        senderId: 'non-existing-sender',
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})

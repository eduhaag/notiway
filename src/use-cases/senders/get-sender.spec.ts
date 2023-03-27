import { beforeEach, describe, expect, it } from 'vitest'
import { InMemorySenderRepository } from '@/respositories/in-memory/in-memory-senders-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found'
import { GetSenderUseCase } from './get-sender'
import { axiosPostMock } from '@/utils/test/mocks/axios-mock'

let sendersRepository: InMemorySenderRepository
let sut: GetSenderUseCase

axiosPostMock()

describe('Get sender use case', () => {
  beforeEach(() => {
    sendersRepository = new InMemorySenderRepository()
    sut = new GetSenderUseCase(sendersRepository)
  })

  it('should be able to get the sender', async () => {
    const { id } = await sendersRepository.create({
      api_token: 'api-token',
      full_number: '(99)99999-9999',
      name: 'sender 1',
      type: 'SHARED',
    })

    const { sender, connection_status } = await sut.execute({
      senderId: id,
    })

    expect(connection_status).toEqual(expect.any(String))
    expect(sender.id).toEqual(id)
  })

  it('should not be able to get the QR code of a non-existing sender', async () => {
    expect(async () => {
      await sut.execute({
        senderId: 'non-existing-sender',
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})

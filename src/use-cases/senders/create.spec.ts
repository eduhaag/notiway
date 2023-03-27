import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryConsumersRepository } from '@/respositories/in-memory/in-memory-consumers-repository'
import { CreateSenderUseCase } from './create'
import { InMemorySenderRepository } from '@/respositories/in-memory/in-memory-senders-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found'
import { SenderFullNumberAlreadyExists } from '../errors/sender-full-number-already-exists-error'
import { SenderNameAlreadyExists } from '../errors/sender-name-already-exists-error'
import { axiosPostMock } from '@/utils/test/mocks/axios-mock'

let sendersRepository: InMemorySenderRepository
let consumersRepository: InMemoryConsumersRepository
let sut: CreateSenderUseCase

axiosPostMock()

describe('Create sender use case', () => {
  beforeEach(() => {
    consumersRepository = new InMemoryConsumersRepository()
    sendersRepository = new InMemorySenderRepository()
    sut = new CreateSenderUseCase(sendersRepository, consumersRepository)
  })

  it('should be able to create a new sender', async () => {
    const { sender } = await sut.execute({
      name: 'sender-example',
      type: 'SHARED',
      fullNumber: '(99) 99999-9999',
    })

    expect(sender.id).toEqual(expect.any(String))
  })

  it('should not be able to create a new sender with a non-existing consumer Id', async () => {
    expect(async () => {
      await sut.execute({
        consumerId: 'non-existing-consumer-id',
        name: 'sender-example',
        fullNumber: '(99) 99999-9999',
        type: 'EXCLUSIVE',
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to create two senders with same name', async () => {
    await sendersRepository.create({
      type: 'SHARED',
      full_number: 'example',
      name: 'same-name-sender',
      api_token: 'api-token',
    })

    expect(async () => {
      await sut.execute({
        name: 'same-name-sender',
        fullNumber: '(47) 99999-9999',
        type: 'EXCLUSIVE',
      })
    }).rejects.toBeInstanceOf(SenderNameAlreadyExists)
  })

  it('should not be able to create two senders with same full number', async () => {
    await sendersRepository.create({
      type: 'SHARED',
      full_number: 'same-full-number',
      name: 'sender 1',
      api_token: 'api-token',
    })

    expect(async () => {
      await sut.execute({
        name: 'sender 2',
        fullNumber: 'same-full-number',
        type: 'EXCLUSIVE',
      })
    }).rejects.toBeInstanceOf(SenderFullNumberAlreadyExists)
  })
})

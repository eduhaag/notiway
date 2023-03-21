import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryConsumersRepository } from '@/respositories/in-memory/in-memory-consumers-repository'
import { InMemorySenderRepository } from '@/respositories/in-memory/in-memory-senders-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found'
import { UpdateSenderUseCase } from './update'

let sendersRepository: InMemorySenderRepository
let consumersRepository: InMemoryConsumersRepository
let sut: UpdateSenderUseCase

describe('Update sender use case', () => {
  beforeEach(() => {
    consumersRepository = new InMemoryConsumersRepository()
    sendersRepository = new InMemorySenderRepository()
    sut = new UpdateSenderUseCase(sendersRepository, consumersRepository)
  })

  it('should be able to uptade a sender', async () => {
    const sender = await sendersRepository.create({
      api_token: 'api-token',
      full_number: '+5599999999999',
      name: 'sender 1',
      type: 'EXCLUSIVE',
    })

    await sut.execute({
      id: sender.id,
      type: 'PRIVATE',
      last_recharge: new Date(),
    })

    const response = await sendersRepository.findById(sender.id)

    expect(response?.type).toEqual('PRIVATE')
    expect(response?.last_recharge).toEqual(expect.any(Date))
  })

  it('should not be able to uptade a sender with a non-existing consumer Id', async () => {
    const sender = await sendersRepository.create({
      api_token: 'api-token',
      full_number: '+5599999999999',
      name: 'sender 1',
      type: 'EXCLUSIVE',
    })

    expect(async () => {
      await sut.execute({
        id: sender.id,
        consumer_id: 'non-existing-consumer-id',
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to update a non-existing-sender', async () => {
    expect(async () => {
      await sut.execute({ id: 'non-exinsting-sender-id' })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})

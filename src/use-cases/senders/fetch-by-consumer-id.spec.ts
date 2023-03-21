import { beforeEach, describe, expect, it } from 'vitest'
import { InMemorySenderRepository } from '@/respositories/in-memory/in-memory-senders-repository'
import { FetchSendersByConsumerIdUseCase } from './fetch-by-consumer-id'

let sendersRepository: InMemorySenderRepository
let sut: FetchSendersByConsumerIdUseCase

describe('Fetch sender use case', () => {
  beforeEach(() => {
    sendersRepository = new InMemorySenderRepository()
    sut = new FetchSendersByConsumerIdUseCase(sendersRepository)
  })

  it('should not be able to fetch sender filtering by consumer ID', async () => {
    await sendersRepository.create({
      api_token: 'api-token',
      full_number: 'example-full-number',
      name: 'sender-example-1',
      type: 'SHARED',
      consumer_id: 'consumer-id-example',
    })

    await sendersRepository.create({
      api_token: 'api-token',
      full_number: 'example-full-number',
      name: 'sender-example-2',
      type: 'SHARED',
      consumer_id: 'consumer-id-other',
    })

    await sendersRepository.create({
      api_token: 'api-token',
      full_number: 'example-full-number',
      name: 'sender-example-3',
      type: 'EXCLUSIVE',
      consumer_id: 'consumer-id-example',
    })

    const { senders } = await sut.execute({ consumerId: 'consumer-id-example' })

    expect(senders).toHaveLength(2)
    expect(senders).toEqual([
      expect.objectContaining({ name: 'sender-example-1' }),
      expect.objectContaining({ name: 'sender-example-3' }),
    ])
  })
})

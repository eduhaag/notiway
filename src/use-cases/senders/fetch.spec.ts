import { beforeEach, describe, expect, it } from 'vitest'
import { InMemorySenderRepository } from '@/respositories/in-memory/in-memory-senders-repository'
import { FetchSendersUseCase } from './fetch'

let sendersRepository: InMemorySenderRepository
let sut: FetchSendersUseCase

describe('Fetch sender use case', () => {
  beforeEach(() => {
    sendersRepository = new InMemorySenderRepository()
    sut = new FetchSendersUseCase(sendersRepository)
  })

  it('should be able to fetch all sender', async () => {
    await sendersRepository.create({
      api_token: 'api-token',
      full_number: 'example-full-number',
      name: 'sender-example-1',
      type: 'EXCLUSIVE',
    })

    await sendersRepository.create({
      api_token: 'api-token',
      full_number: 'example-full-number',
      name: 'sender-example-2',
      type: 'EXCLUSIVE',
    })

    await sendersRepository.create({
      api_token: 'api-token',
      full_number: 'example-full-number',
      name: 'sender-example-3',
      type: 'EXCLUSIVE',
    })

    const { senders } = await sut.execute({})

    expect(senders).toHaveLength(3)
    expect(senders).toEqual([
      expect.objectContaining({ name: 'sender-example-1' }),
      expect.objectContaining({ name: 'sender-example-2' }),
      expect.objectContaining({ name: 'sender-example-3' }),
    ])
  })

  it('should not be able to fetch sender filtering by type', async () => {
    await sendersRepository.create({
      api_token: 'api-token',
      full_number: 'example-full-number',
      name: 'sender-example-1',
      type: 'SHARED',
    })

    await sendersRepository.create({
      api_token: 'api-token',
      full_number: 'example-full-number',
      name: 'sender-example-2',
      type: 'SHARED',
    })

    await sendersRepository.create({
      api_token: 'api-token',
      full_number: 'example-full-number',
      name: 'sender-example-3',
      type: 'EXCLUSIVE',
    })

    const { senders } = await sut.execute({ type: 'SHARED' })

    expect(senders).toHaveLength(2)
    expect(senders).toEqual([
      expect.objectContaining({ name: 'sender-example-1' }),
      expect.objectContaining({ name: 'sender-example-2' }),
    ])
  })

  it('should not be able to fetch sender filtering the enabled', async () => {
    await sendersRepository.create({
      api_token: 'api-token',
      full_number: 'example-full-number',
      name: 'sender-example-1',
      type: 'SHARED',
      disabled_at: new Date(),
    })

    await sendersRepository.create({
      api_token: 'api-token',
      full_number: 'example-full-number',
      name: 'sender-example-2',
      type: 'SHARED',
    })

    await sendersRepository.create({
      api_token: 'api-token',
      full_number: 'example-full-number',
      name: 'sender-example-3',
      type: 'EXCLUSIVE',
    })

    const { senders } = await sut.execute({ enabled: true })

    expect(senders).toHaveLength(2)
    expect(senders).toEqual([
      expect.objectContaining({ name: 'sender-example-2' }),
      expect.objectContaining({ name: 'sender-example-3' }),
    ])
  })

  it('should not be able to fetch sender filtering the disabled', async () => {
    await sendersRepository.create({
      api_token: 'api-token',
      full_number: 'example-full-number',
      name: 'sender-example-1',
      type: 'SHARED',
      disabled_at: new Date(),
    })

    await sendersRepository.create({
      api_token: 'api-token',
      full_number: 'example-full-number',
      name: 'sender-example-2',
      type: 'SHARED',
    })

    await sendersRepository.create({
      api_token: 'api-token',
      full_number: 'example-full-number',
      name: 'sender-example-3',
      type: 'EXCLUSIVE',
    })

    const { senders } = await sut.execute({ enabled: false })

    expect(senders).toHaveLength(1)
    expect(senders).toEqual([
      expect.objectContaining({ name: 'sender-example-1' }),
    ])
  })

  it('should not be able to fetch sender filtering the national code', async () => {
    await sendersRepository.create({
      api_token: 'api-token',
      full_number: 'example-full-number',
      name: 'sender-example-1',
      type: 'SHARED',
      national_code: 47,
    })

    await sendersRepository.create({
      api_token: 'api-token',
      full_number: 'example-full-number',
      name: 'sender-example-2',
      type: 'SHARED',
      national_code: 11,
    })

    await sendersRepository.create({
      api_token: 'api-token',
      full_number: 'example-full-number',
      name: 'sender-example-3',
      type: 'EXCLUSIVE',
      national_code: 11,
    })

    const { senders } = await sut.execute({ nationalCode: 11 })

    expect(senders).toHaveLength(2)
    expect(senders).toEqual([
      expect.objectContaining({ name: 'sender-example-2' }),
      expect.objectContaining({ name: 'sender-example-3' }),
    ])
  })

  it('should not be able to fetch sender filtering last recharge', async () => {
    await sendersRepository.create({
      api_token: 'api-token',
      full_number: 'example-full-number',
      name: 'sender-example-1',
      type: 'SHARED',
      national_code: 47,
      last_recharge: new Date('2023-03-10'),
    })

    await sendersRepository.create({
      api_token: 'api-token',
      full_number: 'example-full-number',
      name: 'sender-example-2',
      type: 'SHARED',
      national_code: 11,
      last_recharge: new Date('2023-03-20'),
    })

    await sendersRepository.create({
      api_token: 'api-token',
      full_number: 'example-full-number',
      name: 'sender-example-3',
      type: 'EXCLUSIVE',
      national_code: 11,
      last_recharge: new Date('2023-03-12'),
    })

    const { senders } = await sut.execute({
      lastRecharge: {
        from: new Date('2023-03-08'),
        to: new Date('2023-03-15'),
      },
    })

    expect(senders).toHaveLength(2)
    expect(senders).toEqual([
      expect.objectContaining({ name: 'sender-example-1' }),
      expect.objectContaining({ name: 'sender-example-3' }),
    ])
  })
})

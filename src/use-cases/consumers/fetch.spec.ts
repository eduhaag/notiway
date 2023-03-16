import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryConsumersRepository } from '@/respositories/in-memory/in-memory-consumers-repository'
import { FetchConsumersUseCase } from './fetch'

let consumersRepository: InMemoryConsumersRepository
let sut: FetchConsumersUseCase

describe('Fetch consumers use case', () => {
  beforeEach(() => {
    consumersRepository = new InMemoryConsumersRepository()
    sut = new FetchConsumersUseCase(consumersRepository)
  })

  it('should be able to fetch consumers', async () => {
    await consumersRepository.create({
      email: 'johndoe@example.com',
      name: 'John Doe',
    })

    await consumersRepository.create({
      email: 'mariedoe@example.com',
      name: 'Marie Doe',
    })

    const { consumers } = await sut.execute({})

    expect(consumers).toHaveLength(2)
    expect(consumers).toEqual([
      expect.objectContaining({ email: 'johndoe@example.com' }),
      expect.objectContaining({ email: 'mariedoe@example.com' }),
    ])
  })

  it('shoud not be able to fetch consumers by tax ID', async () => {
    await consumersRepository.create({
      email: 'johndoe@example.com',
      name: 'John Doe',
      tax_id: '999.999.999-99',
    })

    await consumersRepository.create({
      email: 'mariedoe@example.com',
      name: 'Marie Doe',
      tax_id: '888.888.888-88',
    })

    const { consumers } = await sut.execute({ taxId: '888.888.888-88' })

    expect(consumers).toHaveLength(1)
    expect(consumers).toEqual([
      expect.objectContaining({ email: 'mariedoe@example.com' }),
    ])
  })

  it('shoud not be able to fetch consumers by email', async () => {
    await consumersRepository.create({
      email: 'johndoe@example.com',
      name: 'John Doe',
    })

    await consumersRepository.create({
      email: 'mariedoe@example.com',
      name: 'Marie Doe',
    })

    const { consumers } = await sut.execute({ email: 'mariedoe' })

    expect(consumers).toHaveLength(1)
    expect(consumers).toEqual([
      expect.objectContaining({ email: 'mariedoe@example.com' }),
    ])
  })

  it('shoud not be able to fetch consumers by name', async () => {
    await consumersRepository.create({
      email: 'johndoe@example.com',
      name: 'John Doe',
    })

    await consumersRepository.create({
      email: 'mariedoe@example.com',
      name: 'Marie Doe',
    })

    const { consumers } = await sut.execute({ name: 'Marie' })

    expect(consumers).toHaveLength(1)
    expect(consumers).toEqual([
      expect.objectContaining({ email: 'mariedoe@example.com' }),
    ])
  })

  it.only('shoud not be able to fetch consumers by accept marketing', async () => {
    await consumersRepository.create({
      email: 'johndoe@example.com',
      name: 'John Doe',
      accept_marketing_at: new Date(),
    })

    await consumersRepository.create({
      email: 'mariedoe@example.com',
      name: 'Marie Doe',
    })

    let response = await sut.execute({ acceptMarketing: true })

    expect(response.consumers).toHaveLength(1)
    expect(response.consumers).toEqual([
      expect.objectContaining({ email: 'johndoe@example.com' }),
    ])

    response = await sut.execute({ acceptMarketing: false })

    expect(response.consumers).toHaveLength(1)
    expect(response.consumers).toEqual([
      expect.objectContaining({ email: 'mariedoe@example.com' }),
    ])
  })
})

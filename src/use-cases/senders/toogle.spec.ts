import { beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemorySenderRepository } from '@/respositories/in-memory/in-memory-senders-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found'
import { ToggleSenderUseCase } from './toogle'
import { api } from '@/lib/axios'

let sendersRepository: InMemorySenderRepository
let sut: ToggleSenderUseCase

const mock = vi.spyOn(api, 'post').mockImplementation(async (data) => {
  if (data.includes('close-session')) {
    return { data: { status: true } }
  }
})

describe('Toggle sender use case', () => {
  beforeEach(() => {
    sendersRepository = new InMemorySenderRepository()
    sut = new ToggleSenderUseCase(sendersRepository)
  })

  it('should be able to toogle sender', async () => {
    const sender = await sendersRepository.create({
      api_token: 'api-token',
      full_number: 'example-full-number',
      name: 'sender-example',
      type: 'EXCLUSIVE',
    })

    await sut.execute({ senderId: sender.id, isEnabled: true })
    let response = await sendersRepository.findById(sender.id)
    expect(response?.disabled_at).toEqual(null)

    await sut.execute({ senderId: sender.id, isEnabled: false })
    response = await sendersRepository.findById(sender.id)
    expect(response?.disabled_at).toEqual(expect.any(Date))

    expect(mock).toBeCalledTimes(1)
  })

  it('should not be able to toogle a non-existing-sender', async () => {
    expect(async () => {
      await sut.execute({
        senderId: 'non-existing-sender-id',
        isEnabled: true,
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})

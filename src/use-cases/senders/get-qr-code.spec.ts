import { beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemorySenderRepository } from '@/respositories/in-memory/in-memory-senders-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found'
import { GetSenderQrCodeUseCase } from './get-qr-code'

let sendersRepository: InMemorySenderRepository
let sut: GetSenderQrCodeUseCase

vi.mock('@/lib/axios.ts', () => {
  return {
    api: {
      post: vi.fn().mockImplementation((data) => {
        if (data.includes('start-session')) {
          return { data: { qrcode: 'fake-qr-code' } }
        }
      }),
    },
  }
})

describe('Get sender qr code use case', () => {
  beforeEach(() => {
    sendersRepository = new InMemorySenderRepository()
    sut = new GetSenderQrCodeUseCase(sendersRepository)
  })

  it('should be able to get the sender QR Code', async () => {
    const sender = await sendersRepository.create({
      api_token: 'api-token',
      full_number: '(99)99999-9999',
      name: 'sender 1',
      type: 'SHARED',
    })

    const { base64Qr } = await sut.execute({
      senderId: sender.id,
    })

    expect(base64Qr).toEqual(expect.any(String))
  })

  it('should not be able to get the QR code of a non-existing sender', async () => {
    expect(async () => {
      await sut.execute({
        senderId: 'non-existing-sender',
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})

import { InMemoryClientTokensRepository } from '@/respositories/in-memory/in-memory-client-tokens-repository'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ClientNotAuthorizedError } from '@/use-cases/errors/client-not-authorized-error'
import { QueuesProvider } from '@/providers/queues-provider'
import { FindByClientTokenUseCase } from './find-by-client-token'

let clientTokensRepository: InMemoryClientTokensRepository
let queuesProvider: QueuesProvider
let sut: FindByClientTokenUseCase

describe('Find schedule by client token use case', () => {
  beforeEach(async () => {
    clientTokensRepository = new InMemoryClientTokensRepository()
    queuesProvider = new QueuesProvider()
    sut = new FindByClientTokenUseCase(clientTokensRepository, queuesProvider)

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

  it('should be to find schedule by  client token', async () => {
    vi.spyOn(queuesProvider, 'findJobByClientId').mockImplementation(
      async () => {
        return [
          {
            id: 'job-1',
            name: 'send-message',
            data: {
              clientId: 'clientId',
            },
            priority: 0,
            type: 'normal',
          },
          {
            id: 'job-2',
            name: 'send-message',
            data: {
              clientId: 'clientId',
            },
            priority: 0,
            type: 'normal',
          },
        ]
      },
    )

    const response = await sut.execute({ token: 'token-example' })

    expect(response.messages).toEqual([
      expect.objectContaining({ schedule_id: 'job-1' }),
      expect.objectContaining({ schedule_id: 'job-2' }),
    ])
  })

  it('should not be able to update a schedule with a invalid token', async () => {
    expect(async () => {
      await sut.execute({
        token: 'invalid-token',
      })
    }).rejects.toBeInstanceOf(ClientNotAuthorizedError)
  })
})

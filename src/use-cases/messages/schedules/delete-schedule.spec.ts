import { InMemoryClientTokensRepository } from '@/respositories/in-memory/in-memory-client-tokens-repository'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DeleteScheduleUseCase } from './delete-schedule'
import { ClientNotAuthorizedError } from '@/use-cases/errors/client-not-authorized-error'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'
import { QueuesProvider } from '@/providers/queues-provider'

let clientTokensRepository: InMemoryClientTokensRepository
let queuesProvider: QueuesProvider
let sut: DeleteScheduleUseCase

describe('Delete schedule use case', () => {
  beforeEach(async () => {
    clientTokensRepository = new InMemoryClientTokensRepository()
    queuesProvider = new QueuesProvider()
    sut = new DeleteScheduleUseCase(clientTokensRepository, queuesProvider)

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

  it('should be delete a schedule', async () => {
    vi.spyOn(queuesProvider, 'findJobById').mockImplementation(async () => {
      return {
        id: 'job-id',
        name: 'send-message',
        data: {
          clientId: 'clientId',
        },
        priority: 0,
        type: 'normal',
      }
    })

    const deleteSpy = vi
      .spyOn(queuesProvider, 'deleteJob')
      .mockImplementation(async () => {})

    await sut.execute({ scheduleId: 'job-id', token: 'token-example' })

    expect(deleteSpy).toBeCalledTimes(1)
  })

  it('should not be able to delete a schedule with a invalid token', async () => {
    vi.spyOn(queuesProvider, 'findJobById').mockImplementation(async () => {
      return {
        id: 'job-id',
        name: 'send-message',
        data: {
          clientId: 'clientId',
        },
        priority: 0,
        type: 'normal',
      }
    })

    expect(async () => {
      await sut.execute({
        scheduleId: 'job-id',
        token: 'invalid-token',
      })
    }).rejects.toBeInstanceOf(ClientNotAuthorizedError)
  })

  it('should not be able to delete a non-existing schedule', async () => {
    vi.spyOn(queuesProvider, 'findJobById').mockImplementation(async () => {
      return undefined
    })

    expect(async () => {
      await sut.execute({
        scheduleId: 'non-existingSchedule',
        token: 'token-example',
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to delete a schedule if is not owner', async () => {
    vi.spyOn(queuesProvider, 'findJobById').mockImplementation(async () => {
      return {
        id: 'job-id',
        name: 'send-message',
        data: {
          clientId: 'other-client-id',
        },
        priority: 0,
        type: 'normal',
      }
    })

    expect(async () => {
      await sut.execute({
        token: 'token-example',
        scheduleId: 'job-id',
      })
    }).rejects.toBeInstanceOf(ClientNotAuthorizedError)
  })
})

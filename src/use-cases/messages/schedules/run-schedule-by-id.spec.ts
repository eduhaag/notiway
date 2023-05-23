import { InMemoryClientTokensRepository } from '@/respositories/in-memory/in-memory-client-tokens-repository'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ClientNotAuthorizedError } from '@/use-cases/errors/client-not-authorized-error'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'
import { QueuesProvider } from '@/providers/queues-provider'
import { RunScheduleByIdUseCase } from './run-schedule-by-id'

let clientTokensRepository: InMemoryClientTokensRepository
let queuesProvider: QueuesProvider
let sut: RunScheduleByIdUseCase

describe('Run schedule use case', () => {
  beforeEach(async () => {
    clientTokensRepository = new InMemoryClientTokensRepository()
    queuesProvider = new QueuesProvider()
    sut = new RunScheduleByIdUseCase(clientTokensRepository, queuesProvider)

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

  it('should be to run schedule by id', async () => {
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

    const runJob = vi
      .spyOn(queuesProvider, 'runJob')
      .mockImplementation(async () => {})

    await sut.execute({ scheduleId: 'job-id', token: 'token-example' })

    expect(runJob).toBeCalledTimes(1)
  })

  it('should not be able to run a job with a invalid token', async () => {
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

  it('should not be able to run a non-existing schedule', async () => {
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

  it('should not be able to run a schedule if is not owner', async () => {
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

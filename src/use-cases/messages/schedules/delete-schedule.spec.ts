import { beforeEach, describe, expect, it } from 'vitest'
import { DeleteScheduleUseCase } from './delete-schedule'
import { MongoJobsRepository } from '@/respositories/mongo/mongo-jobs-repository'
import { JobsRepository } from '@/respositories/jobs-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'
import { ClientTokensRepository } from '@/respositories/client-tokens-repository'
import { InMemoryClientTokensRepository } from '@/respositories/in-memory/in-memory-client-tokens-repository'
import { Queues } from '@/providers/queues-provider'

let jobsRepository: JobsRepository
let clientTokensRepository: ClientTokensRepository
let sut: DeleteScheduleUseCase

describe('Delete schedule use case', () => {
  beforeEach(async () => {
    jobsRepository = new MongoJobsRepository()
    clientTokensRepository = new InMemoryClientTokensRepository()
    sut = new DeleteScheduleUseCase(jobsRepository, clientTokensRepository)
  })
})

it('should be able to delete a schedule', async () => {
  await clientTokensRepository.create({
    client_id: 'fake-client-id',
    token: 'client-token',
  })

  const queue = new Queues()

  const job = await queue.add({
    data: {
      clientId: 'fake-client-id',
      content: '',
    },
    date: new Date('9999-01-01T01:00:00'),
    queue: 'send-message',
  })

  const jobId = job.attrs._id.toString()

  let jobScheduled = jobsRepository.get(jobId)

  expect(jobScheduled).toBeTruthy()

  await sut.execute({ scheduleId: jobId, token: 'client-token' })

  jobScheduled = jobsRepository.get(jobId)

  expect(jobScheduled).toBe(null)
})

it('should not be able to dele a non-existing job', async () => {
  await clientTokensRepository.create({
    client_id: 'fake-client-id',
    token: 'client-token',
  })

  expect(async () => {
    await sut.execute({
      scheduleId: 'non-existing-id',
      token: 'client-token',
    })
  }).rejects.toBeInstanceOf(ResourceNotFoundError)
})

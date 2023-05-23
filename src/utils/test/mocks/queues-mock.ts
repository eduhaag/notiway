import { QueuesProvider } from '@/providers/queues-provider'
import { vi } from 'vitest'

export function queuesProviderMock() {
  const queuesProvider = new QueuesProvider()

  const addMock = vi
    .spyOn(queuesProvider, 'add')
    .mockImplementation(async () => {
      return 'id'
    })

  const findJobById = vi
    .spyOn(queuesProvider, 'findJobById')
    .mockImplementation(async () => {
      return {
        id: 'fake-job-id',
        name: 'send-message',
        data: {},
        priority: 0,
        type: 'normal',
      }
    })

  const runFailedJobs = vi
    .spyOn(queuesProvider, 'runFailedJobs')
    .mockImplementation(async () => {})

  return { queuesProvider, mocks: { addMock, findJobById, runFailedJobs } }
}

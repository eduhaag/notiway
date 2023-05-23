import { QueuesProvider } from '@/providers/queues-provider'
import { vi } from 'vitest'

export function queuesProviderMock() {
  const queuesProvider = new QueuesProvider()

  const addMock = vi
    .spyOn(queuesProvider, 'add')
    .mockImplementation(async () => {})

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

  return { queuesProvider, mocks: { addMock, findJobById } }
}

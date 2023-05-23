import { beforeEach, describe, expect, it } from 'vitest'
import { RunFailedSchedulesUseCase } from './run-failed-schedules'
import { queuesProviderMock } from '@/utils/test/mocks/queues-mock'

let sut: RunFailedSchedulesUseCase

const { mocks, queuesProvider } = queuesProviderMock()

describe('Delete schedule use case', () => {
  beforeEach(async () => {
    sut = new RunFailedSchedulesUseCase(queuesProvider)
  })

  it('should be delete a schedule', async () => {
    await sut.execute({})

    expect(mocks.runFailedJobs).toBeCalledTimes(1)
  })
})

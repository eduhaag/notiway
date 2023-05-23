import { queuesProvider } from '@/app'
import { RunFailedSchedulesUseCase } from '../schedules/run-failed-schedules'

export function makeRunFailedSchedulesUseCase() {
  const useCase = new RunFailedSchedulesUseCase(queuesProvider)

  return useCase
}

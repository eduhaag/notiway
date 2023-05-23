import { queuesProvider } from '@/app'
import { RunFailJobsUseCase } from '../schedules/run-fail-jobs'

export function makeRunFailJobsUseCase() {
  const useCase = new RunFailJobsUseCase(queuesProvider)

  return useCase
}

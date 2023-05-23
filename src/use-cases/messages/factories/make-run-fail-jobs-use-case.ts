import { RunFailJobsUseCase } from '../schedules/run-fail-jobs'

export function makeRunFailJobsUseCase() {
  const useCase = new RunFailJobsUseCase()

  return useCase
}

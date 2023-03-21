import { PrismaSendersRepository } from '@/respositories/prisma/prisma-senders-repository'
import { ToggleSenderUseCase } from '../toggle'

export function makeToggleSenderUseCase() {
  const sendersRepository = new PrismaSendersRepository()

  const useCase = new ToggleSenderUseCase(sendersRepository)

  return useCase
}

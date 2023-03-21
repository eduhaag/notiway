import { PrismaSendersRepository } from '@/respositories/prisma/prisma-senders-repository'
import { GetSenderQrCodeUseCase } from '../get-qr-code'

export function makeGetSenderQrCodeUseCase() {
  const sendersRepository = new PrismaSendersRepository()

  const useCase = new GetSenderQrCodeUseCase(sendersRepository)

  return useCase
}

import { EtherealMailProvider } from '@/providers/mail-provider/implementations/etherealMailProvider'
import { vi } from 'vitest'

export const mailProvider = new EtherealMailProvider()

export function mailMock() {
  return vi.spyOn(mailProvider, 'sendMail').mockImplementation(async () => {})
}

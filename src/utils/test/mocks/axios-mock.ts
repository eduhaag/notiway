import { api } from '@/lib/axios'
import { vi } from 'vitest'

export function axiosPostMock() {
  return vi.spyOn(api, 'post').mockImplementation(async (data) => {
    if (data.includes('close-session')) {
      return { data: { status: true } }
    }

    if (data.includes('send-message')) {
      return { data: { ok: 'ok' } }
    }

    if (data.includes('generate-token')) {
      return { data: { token: 'fake-token' } }
    }

    if (data.includes('start-session')) {
      return { data: { qrcode: 'fake-qr-code', status: 'qrcode' } }
    }

    if (data.includes('status-session')) {
      return { data: { qrcode: 'fake-qr-code', status: 'qrcode' } }
    }
  })
}

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

    if (data.includes('logout-session')) {
      return { data: { status: true } }
    }

    if (data.includes('send-location')) {
      return { data: { status: 'success' } }
    }

    if (data.includes('contact-vcard')) {
      return { data: { status: 'success' } }
    }

    if (data.includes('send-sticker-gif')) {
      return { data: { status: 'success' } }
    }

    if (data.includes('send-sticker')) {
      return { data: { status: 'success' } }
    }
  })
}

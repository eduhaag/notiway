import { app } from '@/app'

export function watchSenderStatus(senderName: string) {
  app.io.on(`sender-status:${senderName}`, () => {})
}

export function watchSenderQr(senderName: string) {
  app.io.on(`sender-qrcode:${senderName}`, () => {})
}

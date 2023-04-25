import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import socket from '@/lib/socket'

export function sendersLogOnSocket() {
  socket.off('session-logged').on('session-logged', async (data) => {
    const sender = await prisma.sender.findUnique({
      where: { name: data.session },
    })

    if (sender) {
      await prisma.sender.update({
        where: { id: sender.id },
        data: { paread_at: data.status ? new Date() : null },
      })
    }
  })

  socket.off('qrCode').on('qrCode', async (data) => {
    app.io.emit(`sender-qrcode:${data.session}`, { base64Qr: data.data })
  })
}

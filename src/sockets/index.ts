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
}

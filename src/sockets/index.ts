import { prisma } from '@/lib/prisma'
import socket from '@/lib/socket'

export function sendersLogOnSocket() {
  socket.off('session-logged').on('session-logged', async (status) => {
    if (status.session === true) {
      const sender = await prisma.sender.findUnique({
        where: { name: status.session },
      })

      if (sender) {
        await prisma.sender.update({
          where: { id: sender.id },
          data: { paread_at: new Date() },
        })
      }
    }
  })
}

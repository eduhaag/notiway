import { Message } from '@/DTOS/message-types'
import { env } from '@/env'
import { api } from '@/lib/axios'

export async function sendToWppConnect(body: Message) {
  const { apiToken, content, to, senderName } = body

  switch (content.type) {
    case 'TEXT': {
      const url = `/${senderName}/send-message`
      return await send(
        {
          phone: to,
          message: content.message,
        },
        url,
        apiToken,
      )
    }
  }
}

async function send(data: any, url: string, key: string) {
  try {
    const response = await api.post(`${env.WPP_URL}${url}`, data, {
      headers: {
        Authorization: `Bearer ${key}`,
      },
    })
    return response.data
  } catch (error) {
    throw error
  }
}

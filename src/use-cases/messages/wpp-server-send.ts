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
    case 'LOCATION': {
      const { lat, lng, address, title } = content

      const url = `/${senderName}/send-location`

      return await send(
        {
          phone: to,
          lat,
          lng,
          address,
          title,
        },
        url,
        apiToken,
      )
    }
    case 'LINK': {
      const url = `/${senderName}/send-link-preview`

      return await send(
        {
          phone: to,
          url: content.url,
          caption: content.caption,
        },
        url,
        apiToken,
      )
    }
    case 'AUDIO': {
      const { base64Ptt } = content

      const url = `/${senderName}/send-voice-base64`

      return await send(
        {
          phone: to,
          base64: base64Ptt,
        },
        url,
        apiToken,
      )
    }
    case 'FILE': {
      const { base64, filename, message } = content

      const url = `/${senderName}/send-file-base64`

      return await send(
        {
          phone: to,
          base64,
          filename,
          message,
        },
        url,
        apiToken,
      )
    }
    case 'IMAGE': {
      const { base64, message } = content

      const url = `/${senderName}/send-image`

      return await send(
        {
          phone: to,
          base64,
          message,
        },
        url,
        apiToken,
      )
    }
    case 'BUTTON': {
      const { options, message } = content

      const url = `/${senderName}/send-buttons`

      return await send(
        {
          phone: to,
          message,
          options: {
            useTemplateButtons: true,
            ...options,
          },
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

import { Message } from '@/DTOS/message-types'
import { env } from '@/env'
import { api } from '@/lib/axios'
import { randomInt } from 'crypto'

interface SendSeenReq {
  senderName: string
  phone: string
  key: string
}

interface SetTypingReq {
  senderName: string
  phone: string
  key: string
  isTyping: boolean
}

interface SendMessageReq {
  url: string
  requestBody: {}
  key: string
}

export async function sendToWppConnect(body: Message) {
  const { apiToken, content, to, senderName } = body

  let url: string
  let requestBody: {}

  switch (content.type) {
    case 'TEXT': {
      url = `/${senderName}/send-message`

      requestBody = {
        phone: to,
        message: content.message,
      }

      break
    }

    case 'LOCATION': {
      const { lat, lng, address, title } = content

      url = `/${senderName}/send-location`

      requestBody = {
        phone: to,
        lat,
        lng,
        address,
        title,
      }

      break
    }

    case 'LINK': {
      url = `/${senderName}/send-link-preview`

      requestBody = {
        phone: to,
        url: content.url,
        caption: content.caption,
      }

      break
    }

    case 'AUDIO': {
      const { base64 } = content

      url = `/${senderName}/send-voice-base64`

      requestBody = {
        phone: to,
        base64Ptt: base64,
      }

      break
    }

    case 'FILE': {
      const { base64, filename, message } = content

      url = `/${senderName}/send-file-base64`

      requestBody = {
        phone: to,
        base64,
        filename,
        message,
      }

      break
    }

    case 'IMAGE': {
      const { base64, message } = content

      url = `/${senderName}/send-image`

      requestBody = {
        phone: to,
        base64,
        message,
      }

      break
    }

    case 'CONTACT': {
      const { contact, name } = content

      url = `/${senderName}/contact-vcard`

      requestBody = {
        phone: to,
        contactsId: `${contact}@c.us`,
        name,
      }

      break
    }

    case 'GIF': {
      url = `/${senderName}/send-sticker-gif`

      requestBody = {
        phone: to,
        path: content.url,
      }

      break
    }

    case 'STICKER': {
      url = `/${senderName}/send-sticker`

      requestBody = {
        phone: to,
        path: content.url,
      }
    }
  }

  try {
    await sendSeen({ key: apiToken, phone: to, senderName })

    await setTyping({ isTyping: true, key: apiToken, phone: to, senderName })

    const writingDelay = randomInt(1, 10) * 1000 // miliseconds

    setTimeout(async () => {
      await setTyping({ isTyping: false, key: apiToken, phone: to, senderName })
      const response = await sendMessage({ key: apiToken, requestBody, url })

      return response
    }, writingDelay)
  } catch (error) {
    throw error
  }
}

async function sendSeen({ senderName, phone, key }: SendSeenReq) {
  try {
    await api.post(
      `${env.WPP_URL}/${senderName}/send-seen`,
      {
        phone,
      },
      {
        headers: {
          Authorization: `Bearer ${key}`,
        },
      },
    )
  } catch (error) {
    throw error
  }
}

async function setTyping({ senderName, phone, key, isTyping }: SetTypingReq) {
  try {
    await api.post(
      `${env.WPP_URL}/${senderName}/typing`,
      {
        phone,
        value: isTyping,
        isGroup: false,
      },
      {
        headers: {
          Authorization: `Bearer ${key}`,
        },
      },
    )
  } catch (error) {
    throw error
  }
}

async function sendMessage({ url, key, requestBody }: SendMessageReq) {
  try {
    const response = await api.post(`${env.WPP_URL}${url}`, requestBody, {
      headers: {
        Authorization: `Bearer ${key}`,
      },
    })

    return response.data
  } catch (error) {
    throw error
  }
}

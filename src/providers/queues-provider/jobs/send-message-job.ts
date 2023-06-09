import { Message } from '@/DTOS/message-types'
import { env } from '@/env'
import { api } from '@/lib/axios'
import { randomInt } from 'crypto'

interface SendSeenReq {
  senderName: string
  phone: string
  key: string
}

interface SetPreparing {
  senderName: string
  phone: string
  key: string
  isPreparing: boolean
}

interface SendMessageReq {
  url: string
  requestBody: {}
  key: string
}

export async function sendMessage(data: Message, jobId: string) {
  const { apiToken, content, to, senderName } = data

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

    const PREPARING_DELAY = randomInt(1, 10) * 1000 // miliseconds

    if (content.type === 'AUDIO') {
      await setRecording({
        isPreparing: true,
        key: apiToken,
        phone: to,
        senderName,
      })

      setTimeout(async () => {
        await setRecording({
          isPreparing: false,
          key: apiToken,
          phone: to,
          senderName,
        })

        await sendToWpp({ key: apiToken, requestBody, url })
      }, PREPARING_DELAY)
    } else {
      await setTyping({
        isPreparing: true,
        key: apiToken,
        phone: to,
        senderName,
      })

      setTimeout(async () => {
        await setTyping({
          isPreparing: false,
          key: apiToken,
          phone: to,
          senderName,
        })

        await sendToWpp({ key: apiToken, requestBody, url })
      }, PREPARING_DELAY)
    }
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

async function setTyping({
  senderName,
  phone,
  key,
  isPreparing,
}: SetPreparing) {
  try {
    await api.post(
      `${env.WPP_URL}/${senderName}/typing`,
      {
        phone,
        value: isPreparing,
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

async function setRecording({
  senderName,
  phone,
  key,
  isPreparing,
}: SetPreparing) {
  try {
    await api.post(
      `${env.WPP_URL}/${senderName}/recording`,
      {
        phone,
        value: isPreparing,
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

async function sendToWpp({ url, key, requestBody }: SendMessageReq) {
  try {
    await api.post(
      `${env.WPP_URL}${url}`,
      { ...requestBody },
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

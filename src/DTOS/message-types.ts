export type AUDIO = {
  type: 'AUDIO'
  base64Ptt: string
}

export type BUTTON = {
  type: 'BUTTON'
  message?: string
  options: {
    buttons: {
      id: string
      text?: string
      phoneNumber?: string
      url?: string
    }[]
    title?: string
    footer?: string
  }
}

export type FILE = {
  type: 'FILE'
  filename: string
  base64: string
  message?: string
}

export type IMAGE = {
  type: 'IMAGE'
  message?: string
  base64: string
}

export type LINK = {
  type: 'LINK'
  url: string
  caption?: string
}

export type LOCATION = {
  type: 'LOCATION'
  lat: number
  lng: number
  title?: string
  address?: string
}

export type TEXT = {
  type: 'TEXT'
  message: string
}

export interface Message {
  senderName: string
  clientId: string
  apiToken: string
  to: string
  content: AUDIO | BUTTON | FILE | IMAGE | LINK | LOCATION | TEXT
}

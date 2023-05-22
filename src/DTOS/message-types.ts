export type AUDIO = {
  type: 'AUDIO'
  base64: string
}

export type CONTACT = {
  type: 'CONTACT'
  contact: string
  name: string
}

export type FILE = {
  type: 'FILE'
  filename?: string
  base64: string
  message?: string
}

export type GIF = {
  type: 'GIF'
  url: string
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
  lat?: number
  lng?: number
  title?: string
  address?: string
}

export type STICKER = {
  type: 'STICKER'
  url: string
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
  sendedOn?: Date
  content:
    | AUDIO
    | CONTACT
    | FILE
    | GIF
    | IMAGE
    | LINK
    | LOCATION
    | STICKER
    | TEXT
}

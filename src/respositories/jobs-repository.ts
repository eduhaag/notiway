import {
  AUDIO,
  CONTACT,
  FILE,
  GIF,
  IMAGE,
  LINK,
  LOCATION,
  STICKER,
  TEXT,
} from '@/DTOS/message-types'
import { Document, WithId } from 'mongodb'

export interface UpdateJobProps {
  token: string
  scheduleId: string
  sendOn?: Date
  to?: string
  content?:
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

export interface JobsRepository {
  findById(id: string): Promise<WithId<Document> | null>
  deleteById(id: string): Promise<void>
  update(data: UpdateJobProps): Promise<any>
}

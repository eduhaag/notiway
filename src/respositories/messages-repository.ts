import { Message } from '@/DTOS/message-types'

export interface MessagesRepository {
  create(data: Message): Promise<any>
}

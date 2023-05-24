import { Message } from '@/DTOS/message-types'
import { ClientTokensRepository } from '@/respositories/client-tokens-repository'
import { ClientNotAuthorizedError } from '../errors/client-not-authorized-error'
import { ClientNotReadyError } from '../errors/client-not-ready-error'
import { ClientSenderNotReadyError } from '../errors/client-sender-not-ready-error'
import { QueuesProvider } from '@/providers/queues-provider'
import dayjs from 'dayjs'

interface SendStickerUseCaseRequest {
  token: string
  to: string
  url: string
  sendOn?: string
}

interface SendStickerUseCaseResponse {
  ok: boolean
  sended: boolean
  is_scheduled: boolean
  schedule_id?: string
  scheduledFor?: string
}

export class SendStickerUseCase {
  constructor(
    private clientTokensRepository: ClientTokensRepository,
    private queuesProvider: QueuesProvider,
  ) {}

  async execute(
    request: SendStickerUseCaseRequest,
  ): Promise<SendStickerUseCaseResponse> {
    const { token, url, to, sendOn } = request

    const clientToken = await this.clientTokensRepository.findByToken(token)

    if (!clientToken) {
      throw new ClientNotAuthorizedError()
    }

    const { client } = clientToken
    const { sender, status } = client

    if (status !== 'ready') {
      throw new ClientNotReadyError()
    }

    if (!sender || sender.disabled_at || !sender.paread_at) {
      throw new ClientSenderNotReadyError()
    }

    const message: Message = {
      clientId: client.id,
      senderName: sender.name,
      apiToken: sender.api_token,
      to,
      content: {
        type: 'STICKER',
        url,
      },
    }

    const date = sendOn ? new Date(sendOn) : new Date()

    const scheduleId = await this.queuesProvider.add({
      date,
      data: message,
      queue: 'send-message',
    })

    if (dayjs().isBefore(date)) {
      return {
        ok: true,
        sended: false,
        is_scheduled: true,
        schedule_id: scheduleId,
        scheduledFor: sendOn,
      }
    }

    return {
      ok: true,
      is_scheduled: false,
      sended: true,
    }
  }
}

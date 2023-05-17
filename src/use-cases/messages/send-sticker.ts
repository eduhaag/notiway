import { Message } from '@/DTOS/message-types'
import queue from '@/providers/queues/queue'
import { ClientTokensRepository } from '@/respositories/client-tokens-repository'
import { ClientNotAuthorizedError } from '../errors/client-not-authorized-error'
import { ClientNotReadyError } from '../errors/client-not-ready-error'
import { ClientSenderNotReadyError } from '../errors/client-sender-not-ready-error'

interface SendStickerUseCaseRequest {
  token: string
  to: string
  url: string
}

export class SendStickerUseCase {
  constructor(private clientTokensRepository: ClientTokensRepository) {}

  async execute(request: SendStickerUseCaseRequest): Promise<void> {
    const { token, url, to } = request

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

    await queue.add('SendToWPP', message)
  }
}

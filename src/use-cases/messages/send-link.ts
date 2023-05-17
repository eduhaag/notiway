import { Message } from '@/DTOS/message-types'
import queue from '@/providers/queues/queue'
import { ClientTokensRepository } from '@/respositories/client-tokens-repository'
import { ClientNotAuthorizedError } from '../errors/client-not-authorized-error'
import { ClientNotReadyError } from '../errors/client-not-ready-error'
import { ClientSenderNotReadyError } from '../errors/client-sender-not-ready-error'

interface SendLinkUseCaseRequest {
  token: string
  to: string
  url: string
  caption?: string
}

export class SendLinkUseCase {
  constructor(private clientTokensRepository: ClientTokensRepository) {}

  async execute(request: SendLinkUseCaseRequest): Promise<void> {
    const { token, to, url, caption } = request

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
        type: 'LINK',
        url,
        caption,
      },
    }

    await queue.add('SendToWPP', message)
  }
}

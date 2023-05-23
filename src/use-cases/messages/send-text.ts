import { Message } from '@/DTOS/message-types'
import { ClientTokensRepository } from '@/respositories/client-tokens-repository'
import { ClientNotAuthorizedError } from '../errors/client-not-authorized-error'
import { ClientNotReadyError } from '../errors/client-not-ready-error'
import { ClientSenderNotReadyError } from '../errors/client-sender-not-ready-error'
import { QueuesProvider } from '@/providers/queues-provider'

interface SendTextUseCaseRequest {
  token: string
  to: string
  text: string
  sendOn?: Date
}

export class SendTextUseCase {
  constructor(
    private clientTokensRepository: ClientTokensRepository,
    private queuesProvider: QueuesProvider,
  ) {}

  async execute(request: SendTextUseCaseRequest): Promise<void> {
    const { token, text, to, sendOn } = request

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

    const messageContent: string = text

    const message: Message = {
      clientId: client.id,
      senderName: sender.name,
      apiToken: sender.api_token,
      to,
      content: {
        type: 'TEXT',
        message: messageContent,
      },
    }

    const date = sendOn ? new Date(sendOn) : new Date()

    await this.queuesProvider.add({
      date,
      data: message,
      queue: 'send-message',
    })
  }
}

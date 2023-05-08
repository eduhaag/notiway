import { Message } from '@/DTOS/message-types'
import queue from '@/providers/queues/queue'
import { ClientTokensRepository } from '@/respositories/client-tokens-repository'
import { ClientNotAuthorizedError } from '../errors/client-not-authorized-error'
import { ClientNotReadyError } from '../errors/client-not-ready-error'
import { ClientSenderNotReadyError } from '../errors/client-sender-not-ready-error'

interface SendTextUseCaseRequest {
  token: string
  to: string
  text: string
}

export class SendTextUseCase {
  constructor(private clientTokensRepository: ClientTokensRepository) {}

  async execute(request: SendTextUseCaseRequest): Promise<void> {
    const { token, text, to } = request

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

    // if (client.header) {
    //   messageContent = `*${client.header}*\n\n${messageContent}`
    // }

    // if (client.footer) {
    //   messageContent = `${messageContent}\n\n_${client.footer}_`
    // }

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

    await queue.add('SendToWPP', message)
  }
}

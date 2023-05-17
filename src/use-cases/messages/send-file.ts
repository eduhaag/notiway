import { AUDIO, FILE, IMAGE, Message } from '@/DTOS/message-types'
import queue from '@/providers/queues/queue'
import { ClientTokensRepository } from '@/respositories/client-tokens-repository'
import { ClientNotAuthorizedError } from '../errors/client-not-authorized-error'
import { ClientNotReadyError } from '../errors/client-not-ready-error'
import { ClientSenderNotReadyError } from '../errors/client-sender-not-ready-error'

interface SendFileUseCaseRequest {
  token: string
  to: string
  base64: string
  fileType: 'IMAGE' | 'AUDIO' | 'FILE'
  text?: string
  fileName?: string
}

export class SendFileUseCase {
  constructor(private clientTokensRepository: ClientTokensRepository) {}

  async execute(request: SendFileUseCaseRequest): Promise<void> {
    const { token, to, base64, text, fileType, fileName } = request

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

    let content: IMAGE | AUDIO | FILE

    switch (fileType) {
      case 'IMAGE': {
        content = {
          type: 'IMAGE',
          base64,
          message: text,
        }
        break
      }
      case 'AUDIO': {
        content = {
          type: 'AUDIO',
          base64,
        }
        break
      }
      case 'FILE': {
        content = {
          type: 'FILE',
          filename: fileName,
          base64,
          message: text,
        }
      }
    }

    const message: Message = {
      clientId: client.id,
      senderName: sender.name,
      apiToken: sender.api_token,
      to,
      content,
    }

    await queue.add('SendToWPP', message)
  }
}

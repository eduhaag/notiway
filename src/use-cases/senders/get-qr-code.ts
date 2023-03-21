import { SendersRepository } from '@/respositories/senders-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found'
import { api } from '@/lib/axios'
import { converteBase64ToDataImage } from '@/utils/convert-base64-to-data-image'
import { SenderDisablerError } from '../errors/sender-disabled-error'

interface GetSenderQrCodeUseCaseRequest {
  senderId: string
}

interface GetSenderQrCodeUseCaseResponse {
  base64Qr?: string
  status?: string
}

interface ApiResponse {
  data: {
    qrcode: string
    status: string
  }
}

export class GetSenderQrCodeUseCase {
  constructor(private sendersRepository: SendersRepository) {}

  async execute({
    senderId,
  }: GetSenderQrCodeUseCaseRequest): Promise<GetSenderQrCodeUseCaseResponse> {
    const sender = await this.sendersRepository.findById(senderId)

    if (!sender) {
      throw new ResourceNotFoundError()
    }

    if (sender.disabled_at && sender.disabled_at !== null) {
      throw new SenderDisablerError()
    }

    const connection: GetSenderQrCodeUseCaseResponse = {}

    try {
      const { data } = (await api.post(
        `/${sender.name}/start-session`,
        {
          waitQrCode: true,
        },
        {
          headers: {
            Authorization: `Bearer ${sender.api_token}`,
          },
        },
      )) as ApiResponse

      connection.base64Qr = converteBase64ToDataImage(data.qrcode)
      connection.status = data.status
    } catch (error) {
      throw error
    }

    return connection
  }
}

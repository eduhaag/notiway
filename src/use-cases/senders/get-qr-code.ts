import { SendersRepository } from '@/respositories/senders-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found'
import { api } from '@/lib/axios'
import { converteBase64ToDataImage } from '@/utils/convert-base64-to-data-image'

interface GetSenderQrCodeUseCaseRequest {
  senderId: string
}

interface GetSenderQrCodeUseCaseResponse {
  base64Qr: string
}

interface ApiResponse {
  data: {
    qrcode: string
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

    let qrcode: string

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

      qrcode = converteBase64ToDataImage(data.qrcode)
    } catch (error) {
      throw error
    }

    return { base64Qr: qrcode }
  }
}

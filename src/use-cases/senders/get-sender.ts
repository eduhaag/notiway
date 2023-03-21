import { SendersRepository } from '@/respositories/senders-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found'
import { api } from '@/lib/axios'
import { SendeType } from '@prisma/client'

interface GGetSenderUseCaseRequest {
  senderId: string
}

interface GetSenderUseCaseResponse {
  connection_status?: string
  sender: {
    id: string
    name: string
    type: SendeType
    company: string | null
    last_recharge: Date | null
    disabled_at: Date | null
    national_code: number | null
    internacional_code: number | null
    region: string | null
    full_number: string
  }
}

interface ApiResponse {
  data: {
    status: string
  }
}

export class GetSenderUseCase {
  constructor(private sendersRepository: SendersRepository) {}

  async execute({
    senderId,
  }: GGetSenderUseCaseRequest): Promise<GetSenderUseCaseResponse> {
    const sender = await this.sendersRepository.findById(senderId)

    if (!sender) {
      throw new ResourceNotFoundError()
    }

    let status

    try {
      const { data } = (await api.post(
        `/${sender.name}/status-session`,
        {
          waitQrCode: true,
        },
        {
          headers: {
            Authorization: `Bearer ${sender.api_token}`,
          },
        },
      )) as ApiResponse

      status = data.status
    } catch (error) {
      throw error
    }

    const { api_token, ...senderToReturn } = sender

    return { connection_status: status, sender: senderToReturn }
  }
}

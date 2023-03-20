import { ConsumersRepository } from '@/respositories/consumers-repository'
import { SendersRepository } from '@/respositories/senders-repository'
import { Sender } from '@prisma/client'
import { ResourceNotFoundError } from '../errors/resource-not-found'
import { SenderFullNumberAlreadyExists } from '../errors/sender-full-number-already-exists-error'
import { SenderNameAlreadyExists } from '../errors/sender-name-already-exists-error'
import { api } from '@/lib/axios'
import { env } from '@/env'

interface CreateSenderUseCaseRequest {
  name: string
  fullNumber: string
  type: 'SHARED' | 'EXCLUSIVE' | 'PRIVATE'
  consumerId?: string
  company?: string
  nationalCode?: number
  internacionalCode?: number
  region?: string
}

interface CreateSenderUseCaseResponse {
  sender: Sender
}

export class CreateSenderUseCase {
  constructor(
    private sendersRepository: SendersRepository,
    private consumersRepository: ConsumersRepository,
  ) {}

  async execute(
    data: CreateSenderUseCaseRequest,
  ): Promise<CreateSenderUseCaseResponse> {
    const {
      fullNumber,
      name,
      type,
      company,
      consumerId,
      internacionalCode,
      nationalCode,
      region,
    } = data

    const fullNumberExists = await this.sendersRepository.findByFullNumber(
      fullNumber,
    )

    if (fullNumberExists) {
      throw new SenderFullNumberAlreadyExists()
    }

    const nameAlreadyExists = await this.sendersRepository.findByName(name)

    if (nameAlreadyExists) {
      throw new SenderNameAlreadyExists()
    }

    if (consumerId) {
      const consumerExists = await this.consumersRepository.findById(consumerId)

      if (!consumerExists) {
        throw new ResourceNotFoundError()
      }
    }

    let apiToken

    // eslint-disable-next-line no-useless-catch
    try {
      const { data } = await api.post(
        `/${name}/${env.WPP_SECRET}/generate-token`,
      )

      apiToken = data.token
    } catch (error) {
      throw error
    }

    const sender = await this.sendersRepository.create({
      api_token: apiToken,
      full_number: fullNumber,
      name,
      type,
      company,
      consumer_id: consumerId,
      internacional_code: internacionalCode,
      national_code: nationalCode,
      region,
    })

    return { sender }
  }
}

import { ConsumersRepository } from '@/respositories/consumers-repository'
import { hash } from 'bcryptjs'
import { EmailAlreadyUsedError } from '../errors/email-already-used-error'
import { TaxIdAlreadyExistsError } from '../errors/tax-id-already-exists-error'
import { Consumer } from '@prisma/client'
import path from 'path'
import { UserTokensRepository } from '@/respositories/user-tokens-repository'
import { UsersRepository } from '@/respositories/users-repository'
import { QueuesProvider } from '@/providers/queues-provider'

interface CreateConsumerUseCaseRequest {
  name: string
  tax_id?: string | null
  email: string
  fone?: string | null
  whatsapp?: string | null
  zip_code?: string | null
  street?: string | null
  number?: string | null
  complement?: string | null
  district?: string | null
  city?: string | null
  province?: string | null
  country?: string | null
  marketingAgree?: boolean
  privacityTermsAgree: boolean
  password: string
}

interface CreateConsumerUseCaseResponse {
  consumer: Consumer
}

export class CreateConsumerUseCase {
  constructor(
    private consumersRepository: ConsumersRepository,
    private usersRepository: UsersRepository,
    private usertTokensRepository: UserTokensRepository,
    private queues: QueuesProvider,
  ) {}

  async execute(
    data: CreateConsumerUseCaseRequest,
  ): Promise<CreateConsumerUseCaseResponse> {
    const {
      email,
      tax_id,
      marketingAgree = true,
      name,
      password,
      city,
      complement,
      country,
      district,
      fone,
      number,
      province,
      street,
      whatsapp,
      zip_code,
      privacityTermsAgree,
    } = data

    const emailAlreadyExists = await this.consumersRepository.findByEmail(email)

    if (emailAlreadyExists) {
      throw new EmailAlreadyUsedError()
    }

    if (tax_id) {
      const taxIdAlreadyExists = await this.consumersRepository.findByTaxId(
        tax_id,
      )

      if (taxIdAlreadyExists) {
        throw new TaxIdAlreadyExistsError()
      }
    }

    const password_hash = await hash(password, 6)

    const consumer = await this.consumersRepository.create({
      name,
      email,
      city,
      complement,
      country,
      district,
      fone,
      number,
      province,
      street,
      tax_id,
      whatsapp,
      zip_code,
      marketing_agree_at: marketingAgree ? new Date() : null,
      privacity_agree_at: privacityTermsAgree ? new Date() : null,
      User: {
        create: {
          email,
          password_hash,
          mail_confirm_at: null,
        },
      },
    })

    const user = await this.usersRepository.findByEmail(email)

    const { token } = await this.usertTokensRepository.create({
      type: 'MAIL_CONFIRM',
      user_id: user!.id,
    })

    const templatePath = path.resolve(
      __dirname,
      '..',
      '..',
      'views',
      'emails',
      'mail-verify.hbs',
    )

    const mail = {
      to: email,
      from: 'atendimento@notiway.com.br',
      subject: 'Notiway | Verificação de E-mail',
      path: templatePath,
      variables: {
        token,
      },
    }

    await this.queues.add({ data: mail, date: new Date(), queue: 'send-mail' })

    return { consumer }
  }
}

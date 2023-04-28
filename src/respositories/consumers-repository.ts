import { Consumer, Prisma } from '@prisma/client'

export interface ConsumersFilter {
  taxId?: string
  name?: string
  email?: string
  marketingAgree?: boolean
}

export interface ConsumersRepository {
  create(data: Prisma.ConsumerCreateWithoutSenderInput): Promise<Consumer>
  save(consumer: Consumer): Promise<void>
  findById(id: string): Promise<Consumer | null>
  findByTaxId(taxId: string): Promise<Consumer | null>
  findByEmail(email: string): Promise<Consumer | null>
  findManyWithFilter(filter: ConsumersFilter): Promise<Consumer[]>
}

import { Prisma, Sender } from '@prisma/client'

export interface SenderFilter {
  type?: 'SHARED' | 'EXCLUSIVE' | 'PRIVATE'
  enabled?: boolean
  nationalCode?: number
  lastRecharge?: {
    from: Date
    to: Date
  }
}

export interface SendersRepository {
  create(data: Prisma.SenderUncheckedCreateInput): Promise<Sender>
  save(sender: Sender): Promise<void>
  findById(id: string): Promise<Sender | null>
  findByName(name: string): Promise<Sender | null>
  findByFullNumber(fullNumber: string): Promise<Sender | null>
  findManyWithFilter(filter: SenderFilter): Promise<Sender[]>
}

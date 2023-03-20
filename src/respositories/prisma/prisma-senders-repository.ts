import { Prisma, Sender } from '@prisma/client'
import { SenderFilter, SendersRepository } from '../senders-repository'
import { prisma } from '@/lib/prisma'

interface FilterParams {
  type?: 'EXCLUSIVE' | 'PRIVATE' | 'SHARED'
  national_code?: number
  last_recharge?: { lte: Date; gte: Date }
  disabled_at?: null | { not: null }
  company?: { contains: string }
}

export class PrismaSendersRepository implements SendersRepository {
  async create(data: Prisma.SenderUncheckedCreateInput) {
    const sender = await prisma.sender.create({ data })

    return sender
  }

  async save(sender: Sender) {
    await prisma.sender.update({ where: { id: sender.id }, data: sender })
  }

  async findById(id: string) {
    const sender = await prisma.sender.findUnique({ where: { id } })

    return sender
  }

  async findByName(name: string) {
    const sender = await prisma.sender.findUnique({ where: { name } })

    return sender
  }

  async findByFullNumber(fullNumber: string) {
    const sender = await prisma.sender.findUnique({
      where: { full_number: fullNumber },
    })

    return sender
  }

  async findManyWithFilter(filter: SenderFilter) {
    const { company, enabled, lastRecharge, natinalCode, type } = filter
    const filterParams: FilterParams = {}

    if (
      !company &&
      enabled === undefined &&
      !lastRecharge &&
      !natinalCode &&
      !type
    ) {
      return await prisma.sender.findMany()
    }

    if (company) {
      filterParams.company = { contains: company }
    }

    if (enabled !== undefined) {
      if (enabled) {
        filterParams.disabled_at = null
      } else {
        filterParams.disabled_at = { not: null }
      }
    }

    if (lastRecharge) {
      filterParams.last_recharge = {
        gte: lastRecharge.from,
        lte: lastRecharge.to,
      }
    }

    if (natinalCode) {
      filterParams.national_code = natinalCode
    }

    if (type) {
      filterParams.type = type
    }

    const senders = await prisma.sender.findMany({ where: filterParams })

    return senders
  }
}

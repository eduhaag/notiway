import { Prisma, Consumer } from '@prisma/client'
import { ConsumersFilter, ConsumersRepository } from '../consumers-repository'
import { prisma } from '@/lib/prisma'

interface FilterParams {
  marketing_agree_at?: null | { not: null }
  email?: { contains: string }
  name?: { contains: string }
  tax_id?: string
}

export class PrismaConsumersRepository implements ConsumersRepository {
  async create(data: Prisma.ConsumerCreateWithoutSenderInput) {
    const response = await prisma.consumer.create({
      data,
    })

    return response
  }

  async save(consumer: Consumer) {
    await prisma.consumer.update({
      where: { id: consumer.id },
      data: consumer,
    })
  }

  async findById(id: string) {
    return await prisma.consumer.findUnique({ where: { id } })
  }

  async findByTaxId(taxId: string) {
    return await prisma.consumer.findUnique({ where: { tax_id: taxId } })
  }

  async findByEmail(email: string) {
    return await prisma.consumer.findUnique({ where: { email } })
  }

  async findManyWithFilter(filter: ConsumersFilter) {
    const { marketingAgree, email, name, taxId } = filter
    const filterParams: FilterParams = {}

    if (marketingAgree === undefined && !email && !name && !taxId) {
      return await prisma.consumer.findMany()
    }

    if (email) {
      filterParams.email = { contains: email }
    }

    if (name) {
      filterParams.name = { contains: name }
    }

    if (taxId) {
      filterParams.tax_id = taxId
    }

    if (marketingAgree !== undefined) {
      if (marketingAgree) {
        filterParams.marketing_agree_at = { not: null }
      } else {
        filterParams.marketing_agree_at = null
      }
    }

    return await prisma.consumer.findMany({
      where: filterParams,
    })
  }
}

import { Prisma, Consumer } from '@prisma/client'
import { ConsumersFilter, ConsumersRepository } from '../consumers-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryConsumersRepository implements ConsumersRepository {
  consumers: Consumer[] = []

  async create(data: Prisma.ConsumerCreateWithoutSenderInput) {
    const consumer: Consumer = {
      id: randomUUID(),
      name: data.name,
      tax_id: data.tax_id ?? null,
      email: data.email,
      fone: data.fone ?? null,
      whatsapp: data.whatsapp ?? null,
      zip_code: data.zip_code ?? null,
      street: data.street ?? null,
      number: data.number ?? null,
      complement: data.complement ?? null,
      district: data.district ?? null,
      city: data.city ?? null,
      province: data.province ?? null,
      country: data.country ?? null,
      accept_marketing_at: data.accept_marketing_at
        ? new Date(data.accept_marketing_at)
        : null,
    }

    this.consumers.push(consumer)

    return consumer
  }

  async save(consumer: Consumer) {
    const consumerIndex = this.consumers.findIndex(
      (item) => item.id === consumer.id,
    )

    this.consumers[consumerIndex] = consumer
  }

  async findById(id: string) {
    return this.consumers.find((item) => item.id === id) ?? null
  }

  async findByTaxId(taxId: string) {
    return this.consumers.find((item) => item.tax_id === taxId) ?? null
  }

  async findByEmail(email: string) {
    return this.consumers.find((item) => item.email === email) ?? null
  }

  async findManyWithFilter(filter: ConsumersFilter) {
    const { name, taxId, email, acceptMarketing } = filter

    if (!name && !taxId && !email && acceptMarketing === undefined) {
      return this.consumers
    }

    return this.consumers.filter((item) => {
      const check = []
      if (name) {
        if (item.name.includes(name)) {
          check.push(true)
        } else {
          check.push(false)
        }
      }

      if (taxId) {
        if (item.tax_id === taxId) {
          check.push(true)
        } else {
          check.push(false)
        }
      }

      if (email) {
        if (item.email.includes(email)) {
          check.push(true)
        } else {
          check.push(false)
        }
      }

      if (acceptMarketing !== undefined) {
        if (acceptMarketing) {
          if (item.accept_marketing_at) {
            check.push(true)
          } else {
            check.push(false)
          }
        } else {
          if (!item.accept_marketing_at) {
            check.push(true)
          } else {
            check.push(false)
          }
        }
      }

      return check.every((value) => {
        return value === true
      })
    })
  }
}

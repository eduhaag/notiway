import { Prisma, Consumer } from '@prisma/client'
import { ConsumersFilter, ConsumersRepository } from '../consumers-repository'
import { randomUUID } from 'node:crypto'
import { InMemoryUsersRepository } from './in-memory-users-repository'

export class InMemoryConsumersRepository implements ConsumersRepository {
  consumers: Consumer[] = []

  constructor(private usersRepository?: InMemoryUsersRepository) {}

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
      marketing_agree_at: data.marketing_agree_at
        ? new Date(data.marketing_agree_at)
        : null,
      privacity_agree_at: data.privacity_agree_at
        ? new Date(data.privacity_agree_at)
        : null,
    }

    this.consumers.push(consumer)

    if (this.usersRepository) {
      await this.usersRepository.create({
        email: data.email,
        password_hash: '',
      })
    }

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
    const { name, taxId, email, marketingAgree } = filter

    if (!name && !taxId && !email && marketingAgree === undefined) {
      return this.consumers
    }

    const consumers = this.consumers.filter((item) => {
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

      if (marketingAgree !== undefined) {
        if (marketingAgree === true) {
          if (item.marketing_agree_at !== null) {
            check.push(true)
          } else {
            check.push(false)
          }
        } else {
          if (item.marketing_agree_at === null) {
            check.push(true)
          } else {
            check.push(false)
          }
        }
      }

      const allTrue = check.every((value) => {
        return value === true
      })

      if (allTrue) {
        return item
      } else {
        return null
      }
    })

    return consumers
  }
}

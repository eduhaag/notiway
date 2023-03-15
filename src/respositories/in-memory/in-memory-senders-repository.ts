import { randomUUID } from 'node:crypto'
import dayjs from 'dayjs'
// eslint-disable-next-line no-unused-vars
import isBetween from 'dayjs/plugin/isBetween'
import { Prisma, Sender } from '@prisma/client'
import { SenderFilter, SendersRepository } from '../senders-repository'

export class InMemorySenderRepository implements SendersRepository {
  senders: Sender[] = []

  async create(data: Prisma.SenderUncheckedCreateInput) {
    const {
      name,
      api_token,
      full_number,
      type,
      company,
      consumer_id,
      disabled_from,
      internacional_code,
      national_code,
      region,
      last_recharge,
    } = data
    const sender: Sender = {
      id: randomUUID(),
      api_token,
      name,
      full_number,
      type,
      company: company ?? null,
      consumer_id: consumer_id ?? null,
      disabled_from: disabled_from ? new Date(disabled_from) : null,
      internacional_code: internacional_code ?? null,
      national_code: national_code ?? null,
      region: region ?? null,
      last_recharge: last_recharge ? new Date(last_recharge) : null,
    }

    this.senders.push(sender)

    return sender
  }

  async save(sender: Sender) {
    const senderIndex = this.senders.findIndex((item) => item.id === sender.id)

    this.senders[senderIndex] = sender
  }

  async findById(id: string) {
    return this.senders.find((item) => item.id === id) ?? null
  }

  async findByName(name: string) {
    return this.senders.find((item) => item.name === name) ?? null
  }

  async findByFullNumber(fullNumber: string) {
    return this.senders.find((item) => item.full_number === fullNumber) ?? null
  }

  async findManyWithFilter(filter: SenderFilter) {
    const { company, enabled, lastRecharge, natinalCode, type } = filter

    if (
      !company &&
      enabled === undefined &&
      !lastRecharge &&
      !natinalCode &&
      !type
    ) {
      return this.senders
    }

    return this.senders.filter((item) => {
      const check = []

      if (company) {
        if (item.company && item.company.includes(company)) {
          check.push(true)
        } else {
          check.push(false)
        }
      }

      if (natinalCode) {
        if (item.national_code === natinalCode) {
          check.push(true)
        } else {
          check.push(false)
        }
      }

      if (type) {
        if (item.type === type) {
          check.push(true)
        } else {
          check.push(false)
        }
      }

      if (enabled !== undefined) {
        if (enabled) {
          if (!item.disabled_from) {
            check.push(true)
          } else {
            check.push(false)
          }
        } else {
          if (item.disabled_from) {
            check.push(true)
          } else {
            check.push(false)
          }
        }
      }

      if (lastRecharge) {
        const startDate = dayjs(lastRecharge.from).startOf('day')
        const endDate = dayjs(lastRecharge.to).endOf('day')
        if (
          item.last_recharge &&
          dayjs(item.last_recharge).isBetween(startDate, endDate, 'day', '[]')
        ) {
          check.push(true)
        } else {
          check.push(false)
        }
      }

      return check.every((value) => {
        return value === true
      })
    })
  }
}

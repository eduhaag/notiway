import { randomUUID } from 'node:crypto'
import dayjs from 'dayjs'
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
      disabled_at,
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
      disabled_at: disabled_at ? new Date(disabled_at) : null,
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
    dayjs.extend(isBetween)
    const { enabled, lastRecharge, nationalCode, type } = filter

    if (enabled === undefined && !lastRecharge && !nationalCode && !type) {
      return this.senders
    }

    return this.senders.filter((item) => {
      const check = []

      if (nationalCode) {
        if (item.national_code === nationalCode) {
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
          if (!item.disabled_at) {
            check.push(true)
          } else {
            check.push(false)
          }
        } else {
          if (item.disabled_at) {
            check.push(true)
          } else {
            check.push(false)
          }
        }
      }

      if (lastRecharge) {
        const startDate = dayjs(lastRecharge.from).startOf('d').toDate()
        const endDate = dayjs(lastRecharge.to).endOf('d').toDate()

        if (
          item.last_recharge &&
          dayjs(item.last_recharge).isBetween(startDate, endDate, 'd', '[]')
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

  async findManyByConsumerId(consumerId: string) {
    return this.senders.filter((sender) => sender.consumer_id === consumerId)
  }
}

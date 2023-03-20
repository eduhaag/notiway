import { Prisma, Client } from '@prisma/client'
import { ClientsRepository } from '../clients-repository'
import { prisma } from '@/lib/prisma'

export class PrismaClientsRepository implements ClientsRepository {
  async create(data: Prisma.ClientUncheckedCreateInput) {
    const client = await prisma.client.create({
      data,
    })

    return client
  }

  async save(client: Client) {
    await prisma.client.update({ where: { id: client.id }, data: client })
  }

  async delete(id: string) {
    await prisma.client.update({
      where: { id },
      data: { deleted_at: new Date() },
    })
  }

  async findById(id: string, withToken: boolean = false) {
    const client = await prisma.client.findFirst({
      where: {
        id,
        deleted_at: null,
      },
      include: { ClientToken: withToken },
    })

    return client
  }

  async findByConsumerId(consumerId: string) {
    const clients = await prisma.client.findMany({
      where: { consumer_id: consumerId, deleted_at: null },
      include: { ClientToken: true },
    })

    return clients
  }
}

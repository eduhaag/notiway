import { randomUUID } from 'node:crypto'
import { Prisma, Client } from '@prisma/client'
import { ClientsRepository } from '../clients-repository'

export class InMemoryClientsRepository implements ClientsRepository {
  clients: Client[] = []

  async create(data: Prisma.ClientUncheckedCreateInput) {
    const { consumer_id, name, footer, header, sender_id } = data

    const client: Client = {
      id: randomUUID(),
      consumer_id,
      name,
      footer: footer ?? null,
      header: header ?? null,
      sender_id: sender_id ?? null,
      status: 'PROCESSING',
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    }

    this.clients.push(client)

    return client
  }

  async save(client: Client) {
    const clientIndex = this.clients.findIndex((item) => item.id === client.id)

    this.clients[clientIndex] = client
  }

  async delete(id: string) {
    const clientIndex = this.clients.findIndex((item) => item.id === id)

    this.clients[clientIndex].deleted_at = new Date()
  }

  async findById(id: string) {
    return (
      this.clients.find((item) => item.id === id && !item.deleted_at) ?? null
    )
  }

  async findByConsumerId(consumerId: string) {
    return this.clients.filter((client) => (client.consumer_id = consumerId))
  }
}

import { Client, Prisma } from '@prisma/client'

export interface ClientsRepository {
  create(data: Prisma.ClientUncheckedCreateInput): Promise<Client>
  save(client: Client): Promise<void>
  delete(id: string): Promise<void>
  findById(id: string, withToken?: boolean): Promise<Client | null>
  findByConsumerId(consumerId: string): Promise<Client[]>
}

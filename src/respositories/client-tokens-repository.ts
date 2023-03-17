import { ClientToken, Prisma } from '@prisma/client'

export interface TokenUpdateData {
  client_id: string
  token: string
}

export interface ClientTokensRepository {
  create(data: Prisma.ClientTokenUncheckedCreateInput): Promise<ClientToken>
  updateByClientId(data: TokenUpdateData): Promise<void>
  findByToken(token: string): Promise<ClientToken | null>
  deleteByClientId(clientId: string): Promise<void>
}

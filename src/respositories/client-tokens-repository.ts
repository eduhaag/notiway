import { ClientToken, Prisma } from '@prisma/client'

export interface TokenUpdateData {
  tokenId: string
  token: string
}

export interface ClientTokensRepository {
  create(data: Prisma.ClientTokenUncheckedCreateInput): Promise<ClientToken>
  save(data: Prisma.ClientTokenUpdateInput): Promise<void>
  findByToken(token: string): Promise<ClientToken | null>
  delete(token: string): Promise<void>
}

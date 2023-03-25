import { ClientToken, Prisma } from '@prisma/client'

export interface TokenUpdateData {
  client_id: string
  token: string
}

export interface FindByTokenResponse {
  token: string
  client: {
    id: string
    status: string | null
    header: string | null
    footer: string | null
    sender?: {
      api_token: string
      name: string
      paread_at: Date | null
      disabled_at: Date | null
    } | null
  }
}

export interface ClientTokensRepository {
  create(data: Prisma.ClientTokenUncheckedCreateInput): Promise<ClientToken>
  updateByClientId(data: TokenUpdateData): Promise<void>
  findByToken(token: string): Promise<FindByTokenResponse | null>
  deleteByClientId(clientId: string): Promise<void>
}

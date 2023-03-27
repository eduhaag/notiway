import { Prisma, ClientToken } from '@prisma/client'
import {
  ClientTokensRepository,
  TokenUpdateData,
} from '../client-tokens-repository'
import { randomUUID } from 'node:crypto'

interface FakeClient {
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

export class InMemoryClientTokensRepository implements ClientTokensRepository {
  tokens: ClientToken[] = []
  client: FakeClient = {
    status: null,
    id: randomUUID(),
    footer: null,
    header: null,
  }

  async create(data: Prisma.ClientTokenUncheckedCreateInput) {
    const token: ClientToken = {
      id: randomUUID(),
      client_id: data.client_id,
      token: data.token,
      updated_at: new Date(),
    }

    this.tokens.push(token)

    return token
  }

  async createFakeClient(data: FakeClient) {
    this.client = data
  }

  async updateByClientId({ client_id, token }: TokenUpdateData) {
    const tokenIndex = this.tokens.findIndex(
      (item) => item.client_id === client_id,
    )

    if (tokenIndex < 0) {
      this.tokens.push({
        client_id,
        id: randomUUID(),
        token,
        updated_at: new Date(),
      })
    } else {
      this.tokens[tokenIndex].token = token
      this.tokens[tokenIndex].updated_at = new Date()
    }
  }

  async findByToken(token: string) {
    const tokenSearched = this.tokens.find((item) => item.token === token)

    if (tokenSearched) {
      return {
        token: tokenSearched.token,
        client: this.client,
      }
    }

    return null
  }

  async deleteByClientId(clientId: string) {
    const tokenIndex = this.tokens.findIndex(
      (item) => item.client_id === clientId,
    )

    this.tokens.splice(tokenIndex, 1)
  }
}

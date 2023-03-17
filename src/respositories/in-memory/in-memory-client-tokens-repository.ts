import { Prisma, ClientToken } from '@prisma/client'
import { ClientTokensRepository } from '../client-tokens-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryClientTokensRepository implements ClientTokensRepository {
  tokens: ClientToken[] = []

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

  async save(token: ClientToken) {
    const tokenIndex = this.tokens.findIndex((item) => item.id === token.id)

    this.tokens[tokenIndex] = token
    this.tokens[tokenIndex].updated_at = new Date()
  }

  async findByToken(token: string) {
    return this.tokens.find((item) => item.token === token) ?? null
  }

  async delete(tokenId: string) {
    const tokenIndex = this.tokens.findIndex((item) => item.id === tokenId)

    this.tokens.splice(tokenIndex, 1)
  }
}

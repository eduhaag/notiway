import { Prisma, UserToken } from '@prisma/client'
import { UserTokensRepository } from '../user-tokens-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryUserTokensRepository implements UserTokensRepository {
  userTokens: UserToken[] = []

  async create({
    user_id,
    expires_date,
  }: Prisma.UserTokenUncheckedCreateInput) {
    const userToken = {
      token: randomUUID(),
      user_id,
      expires_date: new Date(expires_date),
    }

    this.userTokens.push(userToken)
    return userToken
  }

  async delete(token: string) {
    const tokenIndex = this.userTokens.findIndex((item) => item.token === token)

    this.userTokens.splice(tokenIndex, 1)
  }

  async findByToken(token: string) {
    return this.userTokens.find((item) => item.token === token) ?? null
  }
}

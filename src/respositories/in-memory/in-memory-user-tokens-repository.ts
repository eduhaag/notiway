import { Prisma, User, UserToken } from '@prisma/client'
import { UserTokensRepository } from '../user-tokens-repository'
import { randomUUID } from 'node:crypto'
import { UsersRepository } from '../users-repository'

export class InMemoryUserTokensRepository implements UserTokensRepository {
  userTokens: UserToken[] = []

  constructor(public users?: UsersRepository) {}

  async create({
    user_id,
    expires_date,
    type,
  }: Prisma.UserTokenUncheckedCreateInput) {
    const userToken = {
      token: randomUUID(),
      user_id,
      type,
      expires_date: expires_date ? new Date(expires_date) : null,
    }

    this.userTokens.push(userToken)
    return userToken
  }

  async delete(token: string) {
    const tokenIndex = this.userTokens.findIndex((item) => item.token === token)

    this.userTokens.splice(tokenIndex, 1)
  }

  async findByToken(token: string) {
    const userToken =
      this.userTokens.find((item) => item.token === token) ?? null

    if (!userToken) {
      return null
    }

    const user = await this.users?.findById(userToken.user_id)

    if (!user) {
      return null
    }

    const response: (UserToken & { user: User }) | null = {
      expires_date: userToken?.expires_date,
      token: userToken?.token,
      type: userToken.type,
      user_id: userToken?.user_id,
      user,
    }

    return response
  }
}

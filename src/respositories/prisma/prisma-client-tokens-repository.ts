import { Prisma } from '@prisma/client'
import {
  ClientTokensRepository,
  TokenUpdateData,
} from '../client-tokens-repository'
import { prisma } from '@/lib/prisma'

export class PrismaClientTokensRepository implements ClientTokensRepository {
  async create(data: Prisma.ClientTokenUncheckedCreateInput) {
    const token = await prisma.clientToken.create({ data })

    return token
  }

  async updateByClientId(data: TokenUpdateData) {
    await prisma.clientToken.update({
      where: { client_id: data.client_id },
      data: { token: data.token },
    })
  }

  async findByToken(token: string) {
    const clientToken = await prisma.clientToken.findUnique({
      where: { token },
      select: {
        token: true,
        client: {
          select: {
            id: true,
            status: true,
            header: true,
            footer: true,
            sender: {
              select: {
                api_token: true,
                name: true,
                paread_at: true,
                disabled_at: true,
              },
            },
          },
        },
      },
    })

    return clientToken
  }

  async deleteByClientId(clientId: string) {
    await prisma.clientToken.delete({ where: { client_id: clientId } })
  }
}

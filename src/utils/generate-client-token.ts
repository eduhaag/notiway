import { env } from '@/env'
import { hash } from 'bcryptjs'

export async function generateClientToken(clientId: string) {
  const token = await hash(clientId + env.CLIENT_TOKEN_SECRET + new Date(), 6)

  return token
}

import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

interface User {
  email: string
  password: string
  accessLevl?: number
  verified?: boolean
}

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  { email, password, accessLevl = 10, verified = true }: User,
) {
  const user = await prisma.user.create({
    data: {
      email,
      password_hash: await hash(password, 6),
      access_level: accessLevl,
      mail_confirm_at: verified ? new Date() : null,
    },
  })

  const response = await request(app.server).post('/site/sessions').send({
    email,
    password,
  })

  const { token } = response.body

  return { token, user }
}

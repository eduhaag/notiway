import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('Resend verification (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to resend verification mail', async () => {
    const { user } = await createAndAuthenticateUser(app, {
      email: 'johndoe@example.com',
      password: '123456',
      verified: false,
    })

    await prisma.userToken.create({
      data: { type: 'MAIL_CONFIRM', user_id: user.id },
    })

    const response = await request(app.server)
      .post('/site/users/resend-verification')
      .send({ email: 'johndoe@example.com' })

    expect(response.statusCode).toEqual(204)
  })
})

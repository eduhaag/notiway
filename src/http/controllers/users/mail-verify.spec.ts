import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('Mail Verify (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to verify a email', async () => {
    const { user } = await createAndAuthenticateUser(app, {
      email: 'johndoe@example.com',
      password: '123456',
    })

    const { token } = await prisma.userToken.create({
      data: {
        expires_date: null,
        user_id: user.id,
        type: 'MAIL_CONFIRM',
      },
    })

    const response = await request(app.server).patch(
      `/site/users/mail-verify/${token}`,
    )

    expect(response.statusCode).toEqual(204)
  })
})

import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'
import dayjs from 'dayjs'

describe('ResetPassword (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to reset  a user password', async () => {
    const { user } = await createAndAuthenticateUser(app, {
      email: 'johndoe@example.com',
      password: '123456',
    })

    const { token } = await prisma.userToken.create({
      data: {
        expires_date: dayjs().add(48, 'hour').toDate(),
        user_id: user.id,
        type: 'PASSWORD_RESET',
      },
    })

    const response = await request(app.server)
      .patch('/site/users/reset-password')
      .send({ newPassword: 'abcdef', token })

    expect(response.statusCode).toEqual(204)
  })
})

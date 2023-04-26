import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('Update sender e2e', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it.only('should be able to update sender', async () => {
    const { token } = await createAndAuthenticateUser(app, {
      email: 'johndoe@example.com',
      password: '123456',
      accessLevl: 50,
    })

    const sender = await prisma.sender.create({
      data: {
        name: 'sender-example',
        full_number: '+5547999999999',
        type: 'SHARED',
        api_token: 'api-token',
      },
    })

    const response = await request(app.server)
      .put(`/admin/senders/${sender.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ lastRecharge: new Date() })

    expect(response.statusCode).toEqual(204)
  })
})

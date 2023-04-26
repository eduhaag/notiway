import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { axiosPostMock } from '@/utils/test/mocks/axios-mock'

axiosPostMock()

describe('Get sender e2e', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get sender', async () => {
    const { token } = await createAndAuthenticateUser(app, {
      email: 'test@example.com',
      password: '123456',
    })

    const sender = await prisma.sender.create({
      data: {
        api_token: 'api-token',
        full_number: '+5511999999999',
        name: 'sender-test',
        type: 'EXCLUSIVE',
      },
    })

    const response = await request(app.server)
      .get(`/site/senders/${sender.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.connection_status).toEqual(expect.any(String))
    expect(response.body.sender.id).toEqual(expect.any(String))
  })
})

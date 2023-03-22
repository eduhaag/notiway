import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('Fetch senders (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to fetch senders', async () => {
    const { token } = await createAndAuthenticateUser(app, {
      email: 'admin@example.com',
      password: '123456',
      accessLevl: 50,
    })

    await prisma.sender.createMany({
      data: [
        {
          api_token: 'api-token-1',
          full_number: '+5511999999999',
          name: 'sender-1',
          type: 'SHARED',
        },
        {
          api_token: 'api-token-2',
          full_number: '+5522999999999',
          name: 'sender-2',
          type: 'EXCLUSIVE',
        },
        {
          api_token: 'api-token-3',
          full_number: '+5533999999999',
          name: 'sender-3',
          type: 'EXCLUSIVE',
        },
      ],
    })

    const response = await request(app.server)
      .get('/admin/senders/search')
      .query({ type: 'SHARED' })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.senders).toHaveLength(1)
    expect(response.body.senders).toEqual([
      expect.objectContaining({ name: 'sender-1' }),
    ])
  })
})

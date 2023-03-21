import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Fetch senders by consumer Id e2e', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it.only('should be able to fetch senders by consumer Id', async () => {
    const { token } = await createAndAuthenticateUser(app, {
      email: 'test@example.com',
      password: '123456',
    })

    const consumer = await prisma.consumer.create({
      data: { email: 'johndoe@example.com', name: 'John Doe' },
    })

    await prisma.sender.createMany({
      data: [
        {
          api_token: 'api-token-1',
          full_number: '+5511999999999',
          name: 'sender-1',
          type: 'EXCLUSIVE',
          consumer_id: consumer.id,
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
          consumer_id: consumer.id,
        },
      ],
    })

    const response = await request(app.server)
      .get(`/consumers/${consumer.id}/senders`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.senders).toHaveLength(2)
    expect(response.body.senders).toEqual([
      expect.objectContaining({ name: 'sender-1' }),
      expect.objectContaining({ name: 'sender-3' }),
    ])
  })
})

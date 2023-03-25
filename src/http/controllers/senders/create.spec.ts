import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

vi.mock('@/lib/axios.ts', () => {
  return {
    api: {
      post: vi.fn().mockImplementation((data) => {
        if (data.includes('generate-token')) {
          return { data: { token: 'fake-token' } }
        }
      }),
    },
  }
})

describe('Create sender e2e', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a sender', async () => {
    const { token } = await createAndAuthenticateUser(app, {
      email: 'test@example.com',
      password: '123456',
    })

    const consumer = await prisma.consumer.create({
      data: { email: 'johndoe@example.com', name: 'John Doe' },
    })

    const response = await request(app.server)
      .post('/senders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        consumerId: consumer.id,
        name: 'sender-example',
        fullNumber: '+5547999999999',
        type: 'SHARED',
      })

    expect(response.statusCode).toEqual(201)
  })
})

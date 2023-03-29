import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { prisma } from '@/lib/prisma'
import { generateClientToken } from '@/utils/generate-client-token'
import { axiosPostMock } from '@/utils/test/mocks/axios-mock'

const apiMock = axiosPostMock()

describe('Send gif e2e', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to gif sticker', async () => {
    const client = await prisma.client.create({
      data: {
        name: 'client-example',
        status: 'ready',
        consumer: {
          create: { email: 'johndoe@example.com', name: 'John Doe' },
        },
        sender: {
          create: {
            api_token: 'api-token-example',
            full_number: '999999',
            name: 'sender-example',
            type: 'EXCLUSIVE',
            paread_at: new Date(),
          },
        },
      },
    })

    const clientToken = await prisma.clientToken.create({
      data: {
        client_id: client.id,
        token: await generateClientToken(client.id),
      },
    })

    const response = await request(app.server)
      .post('/api/send-gif')
      .set('Authorization', `Bearer ${clientToken.token}`)
      .send({
        to: '5544999999999',
        url: 'http://example.com',
      })

    expect(response.statusCode).toEqual(200)
    expect(apiMock).toBeCalledTimes(1)
  })
})

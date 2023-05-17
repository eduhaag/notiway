import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Forgot Password (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to send forgot password mail', async () => {
    await createAndAuthenticateUser(app, {
      email: 'johndoe@example.com',
      password: '123456',
    })

    const response = await request(app.server)
      .post('/site/users/forgot-password')
      .send({ email: 'johndoe@example.com' })

    expect(response.statusCode).toEqual(204)
  })
})

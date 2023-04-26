import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('User logout (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to logout ', async () => {
    await createAndAuthenticateUser(app, {
      email: 'johndoe@example.com',
      password: '123456',
    })

    await request(app.server).post('/site/sessions').send({
      email: 'johndoe@example.com',
      password: '123456',
    })

    const response = await request(app.server)
      .patch('/site/sessions/logout')
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({ message: expect.any(String) })
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken=;'),
    ])
  })
})

import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Create consumer e2e', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a new consumer', async () => {
    const response = await request(app.server).post('/consumers').send({
      email: 'johndoe@example.com',
      password: '123456',
      name: 'John doe',
    })

    expect(response.statusCode).toEqual(201)
  })
})

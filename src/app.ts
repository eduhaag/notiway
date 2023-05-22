import fastify from 'fastify'

import { sendersLogOnSocket } from './sockets'

import { fastiFyRegister } from './fastify-register'
import { Queues } from './providers/queues-provider'
import { errorHandler } from './error-handler'
import { MongoDb } from './DB/mongoDb'

const MAX_BODY_SIZE = 16 * 1024 * 1024 // 16MB

export const app = fastify({ bodyLimit: MAX_BODY_SIZE })

fastiFyRegister(app)

// connectToMongoDB()
export const mongoDb = new MongoDb()

sendersLogOnSocket()

export const queue = new Queues()

app.setErrorHandler((error, _, reply) => {
  errorHandler(error, reply)
})

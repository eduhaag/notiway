import { extractToken } from '@/http/middlewares/extract-token'
import { FastifyInstance } from 'fastify'
import { deleteSchedule } from './delete-schedule'
import { updateSchedule } from './update-schedule'

export async function schedulesRoutes(app: FastifyInstance) {
  app.addHook('onRequest', extractToken)

  app.delete('/:scheduleId', deleteSchedule)
  app.put('/:scheduleId', updateSchedule)
}

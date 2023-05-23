import { extractToken } from '@/http/middlewares/extract-token'
import { FastifyInstance } from 'fastify'
import { deleteSchedule } from './delete-schedule'
import { updateSchedule } from './update-schedule'
import { finScheduleByClientToken } from './find-by-client-token'
import { runSchedule } from './run-schedule'

export async function schedulesRoutes(app: FastifyInstance) {
  app.addHook('onRequest', extractToken)

  app.delete('/:scheduleId', deleteSchedule)
  app.get('/', finScheduleByClientToken)
  app.put('/:scheduleId', updateSchedule)
  app.post('/:scheduleId/send', runSchedule)
}

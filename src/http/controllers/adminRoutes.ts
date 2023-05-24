import { FastifyInstance } from 'fastify'
import { verifyAdminAccess } from '@/http/middlewares/verify-admin'
import { verifyJWT } from '../middlewares/verify-jwt'
import { create } from './users/create'
import { update } from './users/update'
import { fetch as fetchUsers } from './users/fetch'
import { fetch as fetchConsumers } from './consumers/fetch'
import { fetchSenders } from './senders/fetch'
import { toggle } from './senders/toggle'
import { updateSender } from './senders/update'
import { runFailedSchedules } from './schedules/run-failed-schedules'

export async function adminRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  // ------- users
  app.post('/users', { onRequest: [verifyAdminAccess(50)] }, create)
  app.put('/users/:userId', { onRequest: [verifyAdminAccess(50)] }, update)
  app.get('/users', { onRequest: [verifyAdminAccess(50)] }, fetchUsers)

  // ------ consumers
  app.get(
    '/consumers/search',
    {
      onRequest: [verifyAdminAccess(50)],
    },
    fetchConsumers,
  )

  // ------ senders
  app.get(
    '/senders/search',
    { onRequest: [verifyAdminAccess(50)] },
    fetchSenders,
  )
  app.put(
    '/senders/:senderId',
    {
      onRequest: [verifyAdminAccess(50)],
    },
    updateSender,
  )
  app.patch(
    '/senders/:senderId/toggle-enabled',
    {
      onRequest: [verifyAdminAccess(50)],
    },
    toggle,
  )

  // schedules
  app.post(
    '/schedules/fail/run',
    { onRequest: [verifyAdminAccess(50)] },
    runFailedSchedules,
  )
}

import { FastifyReply, FastifyRequest } from 'fastify'

export async function extractToken(req: FastifyRequest, reply: FastifyReply) {
  if (!req.headers['api-key']) {
    return reply.status(401).send({ message: 'Unauthorized' })
  }

  req.token = req.headers['api-key'].toString()
}

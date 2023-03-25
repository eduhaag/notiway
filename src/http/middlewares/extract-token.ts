import { FastifyReply, FastifyRequest } from 'fastify'

export async function extractToken(req: FastifyRequest, reply: FastifyReply) {
  if (!req.headers.authorization) {
    return reply.status(401).send({ message: 'Unauthorized' })
  }

  const [, token] = req.headers.authorization?.split(' ')

  req.token = token
}

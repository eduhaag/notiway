import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { MailValidationError } from '@/use-cases/errors/mail-validation-error'
import { makeAuthenticateUseCase } from '@/use-cases/users/factories/make-authenticate-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function authenticate(req: FastifyRequest, reply: FastifyReply) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBodySchema.parse(req.body)

  try {
    const authenticateUseCase = makeAuthenticateUseCase()

    const { user, consumer } = await authenticateUseCase.execute({
      email,
      password,
    })

    const token = await reply.jwtSign(
      {
        access_level: user.access_level,
      },
      {
        sign: { sub: user.id },
      },
    )

    const refreshToken = await reply.jwtSign(
      {
        access_level: user.access_level,
      },
      {
        sign: {
          sub: user.id,
          expiresIn: '7d',
        },
      },
    )

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        // secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({ token, consumer })
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: error.message })
    }

    if (error instanceof MailValidationError) {
      return reply.status(401).send({ message: error.message })
    }

    throw error
  }
}

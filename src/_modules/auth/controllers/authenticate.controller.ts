/* eslint-disable @typescript-eslint/no-explicit-any */
import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { compare } from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { InvalidCredentialsError } from '../errors/auth-invalid-credentials.controller'
import { UserUseCaseFactory } from '@/_modules/user/usecases/factories/user-usecases.factory'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

export const authenticate = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({
      username: z.string(),
      password: z.string().min(6),
    })
    const { username, password } = params.parse(request.body)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars

    // Check UserData
    const { user } = await UserUseCaseFactory.findByEmail().execute({
      email: username,
    })
    if (!user) {
      throw new InvalidCredentialsError()
    }
    const doesPasswordMatches = await compare(password, user.password)
    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError()
    }

    const token = jwt.sign(
      { sign: { sub: user.id, business_id: user.business_id } },
      process.env.APP_SECRET as string,
      { expiresIn: '12h' },
    )

    reply.send({ token, userdata: user })
  } catch (error: any) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: error.message })
    }
    if (error instanceof ResourceNotFoundError) {
      return reply.status(400).send({ message: 'Credenciais inválidas' })
    }
    if (error.response) {
      reply.status(400).send({ message: error.response.data.message })
    } else {
      reply.status(500).send({ message: 'Erro interno do servidor' })
    }
  }
}

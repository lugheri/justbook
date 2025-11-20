import { env } from '@/env'
import { FastifyReply, FastifyRequest } from 'fastify'
import jwt, {
  JsonWebTokenError,
  JwtPayload,
  NotBeforeError,
  TokenExpiredError,
} from 'jsonwebtoken'

interface DataAccount {
  id: number
  account_id: number
}

interface DecodedToken extends JwtPayload {
  sign: {
    sub: number
    data_account: DataAccount
  }
}
declare module 'fastify' {
  interface FastifyRequest {
    services?: DataAccount
  }
}

function sendAuthError(reply: FastifyReply, message: string) {
  return reply.status(401).send({ message, errorToken: true })
}

const authMiddleware = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  const token = request.headers.authorization

  if (token === env.INTERNAL_SERVICE_TOKEN) {
    request.services = { id: 0, account_id: 0 }
    return
  }
  // ========== AUTENTICAÇÃO NORMAL COM JWT ==========
  if (!token) {
    sendAuthError(
      reply,
      'Cabeçalho de autorização ausente. Forneça um token válido.',
    )
    return
  }

  const secret = process.env.APP_SECRET
  if (!secret) {
    reply
      .status(500)
      .send({ message: 'Chave APP_SECRET não configurada no servidor.' })
    return
  }

  let payload: DecodedToken
  try {
    payload = jwt.verify(token, secret) as DecodedToken
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      sendAuthError(reply, 'Token expirado.')
    } else if (err instanceof NotBeforeError) {
      sendAuthError(reply, 'Token ainda não válido.')
    } else if (err instanceof JsonWebTokenError) {
      sendAuthError(reply, 'Token inválido.')
    } else {
      reply.status(500).send({ message: 'Erro interno ao validar token.' })
    }
    return
  }

  if (!payload.sign || typeof payload.sign.sub !== 'number') {
    sendAuthError(reply, 'Token malformado.')
    return
  }

  request.services = payload.sign.data_account
  // Em preHandler, basta retornar para continuar
}

export default authMiddleware

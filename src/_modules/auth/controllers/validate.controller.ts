import { FastifyReply, FastifyRequest } from 'fastify'
import jwt from 'jsonwebtoken'

export const validateAuth = (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const authHeader = req.headers.authorization
      ? req.headers.authorization
      : null
    if (authHeader) {
      const payload = jwt.verify(authHeader, process.env.APP_SECRET as string)
      if (payload) {
        reply.send({ success: true, message: 'Token is valid' })
        return
      }
    }
    reply.send(false)
  } catch (err) {
    reply.send(false)
  }
}

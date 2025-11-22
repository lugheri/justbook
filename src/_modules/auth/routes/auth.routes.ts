/* eslint-disable @typescript-eslint/no-explicit-any */
import { FastifyInstance } from 'fastify'
import { validateAuth } from '../controllers/validate.controller'

export const routeAuth: {
  method: 'post' | 'get' | 'put' | 'delete'
  path: string
  handler: any
}[] = [
  {
    method: 'get',
    path: '/validateAuth',
    handler: validateAuth,
  },
]

export default async (app: FastifyInstance) => {
  for (const route of routeAuth) {
    app[route.method](route.path, route.handler)
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { createUser } from '../controller/create-user.controller'
import { getUser } from '../controller/get-user.controller'
import { updateUser } from '../controller/update-user.controller'
import { deleteUser } from '../controller/delete-user.controller'
import { listUsers } from '../controller/list-users.controller'
import { listAllUsers } from '../controller/list-all-users.controller'
import { FastifyInstance } from 'fastify'
import { findByName } from '../controller/find-by-name-user.controller'
export const routesUser: {
  method: 'post' | 'get' | 'put' | 'delete'
  path: string
  handler: any
}[] = [
  { method: 'post', path: '/createUser', handler: createUser },
  { method: 'get', path: '/getUser/:user_id', handler: getUser },
  {
    method: 'put',
    path: '/updateUser/:user_id',
    handler: updateUser,
  },
  {
    method: 'delete',
    path: '/deleteUser/:user_id',
    handler: deleteUser,
  },
  {
    method: 'get',
    path: '/listUsers/:page/:active/:email_search/:name_search',
    handler: listUsers,
  },
  {
    method: 'get',
    path: '/listAllUsers/:active',
    handler: listAllUsers,
  },
  { method: 'get', path: '/findByName/:name', handler: findByName },
]

export default async (app: FastifyInstance) => {
  for (const route of routesUser) {
    app[route.method](route.path, route.handler)
  }
}

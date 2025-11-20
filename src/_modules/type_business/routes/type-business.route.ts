/* eslint-disable @typescript-eslint/no-explicit-any */
import { createTypeBusiness } from '../controller/create-type-business.controller'
import { getTypeBusiness } from '../controller/get-type-business.controller'
import { updateTypeBusiness } from '../controller/update-type-business.controller'
import { deleteTypeBusiness } from '../controller/delete-type-business.controller'
import { listTypeBusiness } from '../controller/list-type-business.controller'
import { listAllTypeBusiness } from '../controller/list-all-type-business.controller'
import { FastifyInstance } from 'fastify'
import { findByName } from '../controller/find-by-name-type-business.controller'
export const routesTypeBusiness: {
  method: 'post' | 'get' | 'put' | 'delete'
  path: string
  handler: any
}[] = [
  { method: 'post', path: '/createTypeBusiness', handler: createTypeBusiness },
  {
    method: 'get',
    path: '/getTypeBusiness/:type_business_id',
    handler: getTypeBusiness,
  },
  {
    method: 'put',
    path: '/updateTypeBusiness/:type_business_id',
    handler: updateTypeBusiness,
  },
  {
    method: 'delete',
    path: '/deleteTypeBusiness/:type_business_id',
    handler: deleteTypeBusiness,
  },
  {
    method: 'get',
    path: '/listTypeBusiness/:page/:name_search',
    handler: listTypeBusiness,
  },
  {
    method: 'get',
    path: '/listAllTypeBusiness',
    handler: listAllTypeBusiness,
  },
  { method: 'get', path: '/findByName/:name', handler: findByName },
]

export default async (app: FastifyInstance) => {
  for (const route of routesTypeBusiness) {
    app[route.method](route.path, route.handler)
  }
}

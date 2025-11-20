/* eslint-disable @typescript-eslint/no-explicit-any */
import { createBusiness } from '../controller/create-business.controller'
import { getBusiness } from '../controller/get-business.controller'
import { updateBusiness } from '../controller/update-business.controller'
import { deleteBusiness } from '../controller/delete-business.controller'
import { listBusiness } from '../controller/list-business.controller'
import { listAllBusiness } from '../controller/list-all-business.controller'
import { FastifyInstance } from 'fastify'
import { findByName } from '../controller/find-by-name-business.controller'
export const routesBusiness: {
  method: 'post' | 'get' | 'put' | 'delete'
  path: string
  handler: any
}[] = [
  { method: 'post', path: '/createBusiness', handler: createBusiness },
  { method: 'get', path: '/getBusiness/:business_id', handler: getBusiness },
  {
    method: 'put',
    path: '/updateBusiness/:business_id',
    handler: updateBusiness,
  },
  {
    method: 'delete',
    path: '/deleteBusiness/:business_id',
    handler: deleteBusiness,
  },
  {
    method: 'get',
    path: '/listBusiness/:page/:active/:agreed/:name_search',
    handler: listBusiness,
  },
  {
    method: 'get',
    path: '/listAllBusiness/:active/:agreed',
    handler: listAllBusiness,
  },
  { method: 'get', path: '/findByName/:name', handler: findByName },
]

export default async (app: FastifyInstance) => {
  for (const route of routesBusiness) {
    app[route.method](route.path, route.handler)
  }
}

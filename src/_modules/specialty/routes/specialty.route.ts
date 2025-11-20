/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSpecialty } from '../controller/create-specialty.controller'
import { getSpecialty } from '../controller/get-specialty.controller'
import { updateSpecialty } from '../controller/update-specialty.controller'
import { deleteSpecialty } from '../controller/delete-specialty.controller'
import { listSpecialties } from '../controller/list-specialties.controller'
import { listAllSpecialties } from '../controller/list-all-specialties.controller'
import { FastifyInstance } from 'fastify'
import { findByName } from '../controller/find-by-name-specialty.controller'
export const routesSpecialty: {
  method: 'post' | 'get' | 'put' | 'delete'
  path: string
  handler: any
}[] = [
  { method: 'post', path: '/createSpecialty', handler: createSpecialty },
  {
    method: 'get',
    path: '/getSpecialty/:specialty_id',
    handler: getSpecialty,
  },
  {
    method: 'put',
    path: '/updateSpecialty/:specialty_id',
    handler: updateSpecialty,
  },
  {
    method: 'delete',
    path: '/deleteSpecialty/:specialty_id',
    handler: deleteSpecialty,
  },
  {
    method: 'get',
    path: '/listSpecialties/:page/:active/:name_search',
    handler: listSpecialties,
  },
  {
    method: 'get',
    path: '/listAllSpecialties/:active',
    handler: listAllSpecialties,
  },
  { method: 'get', path: '/findByName/:name', handler: findByName },
]

export default async (app: FastifyInstance) => {
  for (const route of routesSpecialty) {
    app[route.method](route.path, route.handler)
  }
}

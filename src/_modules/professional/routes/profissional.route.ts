/* eslint-disable @typescript-eslint/no-explicit-any */
import { createProfessional } from '../controller/create-profissional.controller'
import { getProfessional } from '../controller/get-profissional.controller'
import { updateProfessional } from '../controller/update-profissional.controller'
import { deleteProfessional } from '../controller/delete-profissional.controller'
import { listProfessionals } from '../controller/list-profissional.controller'
import { listAllProfessionals } from '../controller/list-all-profissional.controller'
import { FastifyInstance } from 'fastify'
import { findByName } from '../controller/find-by-name-profissional.controller'
export const routesProfessional: {
  method: 'post' | 'get' | 'put' | 'delete'
  path: string
  handler: any
}[] = [
  { method: 'post', path: '/createProfessional', handler: createProfessional },
  {
    method: 'get',
    path: '/getProfessional/:professional_id',
    handler: getProfessional,
  },
  {
    method: 'put',
    path: '/updateProfessional/:professional_id',
    handler: updateProfessional,
  },
  {
    method: 'delete',
    path: '/deleteProfessional/:professional_id',
    handler: deleteProfessional,
  },
  {
    method: 'get',
    path: '/listProfessionals/:page/:active/:name_search',
    handler: listProfessionals,
  },
  {
    method: 'get',
    path: '/listAllProfessionals/:active',
    handler: listAllProfessionals,
  },
  { method: 'get', path: '/findByName/:name', handler: findByName },
]

export default async (app: FastifyInstance) => {
  for (const route of routesProfessional) {
    app[route.method](route.path, route.handler)
  }
}

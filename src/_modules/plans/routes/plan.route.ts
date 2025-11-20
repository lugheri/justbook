/* eslint-disable @typescript-eslint/no-explicit-any */
import { createPlan } from '../controller/create-plan.controller'
import { getPlan } from '../controller/get-plan.controller'
import { updatePlan } from '../controller/update-plan.controller'
import { deletePlan } from '../controller/delete-plan.controller'
import { listPlans } from '../controller/list-plans.controller'
import { listAllPlans } from '../controller/list-all-plans.controller'
import { FastifyInstance } from 'fastify'
import { findByName } from '../controller/find-by-name-plan.controller'
export const routesPlan: {
  method: 'post' | 'get' | 'put' | 'delete'
  path: string
  handler: any
}[] = [
  { method: 'post', path: '/createPlan', handler: createPlan },
  { method: 'get', path: '/getPlan/:plan_id', handler: getPlan },
  {
    method: 'put',
    path: '/updatePlan/:plan_id',
    handler: updatePlan,
  },
  {
    method: 'delete',
    path: '/deletePlan/:plan_id',
    handler: deletePlan,
  },
  {
    method: 'get',
    path: '/listPlans/:page/:status/:vigency/:name_search',
    handler: listPlans,
  },
  {
    method: 'get',
    path: '/listAllPlans/:active',
    handler: listAllPlans,
  },
  { method: 'get', path: '/findByName/:name', handler: findByName },
]

export default async (app: FastifyInstance) => {
  for (const route of routesPlan) {
    app[route.method](route.path, route.handler)
  }
}

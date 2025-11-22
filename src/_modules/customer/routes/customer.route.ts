/* eslint-disable @typescript-eslint/no-explicit-any */
import { createCustomer } from '../controller/create-customer.controller'
import { getCustomer } from '../controller/get-customer.controller'
import { updateCustomer } from '../controller/update-customer.controller'
import { deleteCustomer } from '../controller/delete-customer.controller'
import { listCustomers } from '../controller/list-customers.controller'
import { listAllCustomers } from '../controller/list-all-customers.controller'
import { FastifyInstance } from 'fastify'
import { findByName } from '../controller/find-by-name-customer.controller'
export const routesCustomer: {
  method: 'post' | 'get' | 'put' | 'delete'
  path: string
  handler: any
}[] = [
  { method: 'post', path: '/createCustomer', handler: createCustomer },
  {
    method: 'get',
    path: '/getCustomer/:customer_id',
    handler: getCustomer,
  },
  {
    method: 'put',
    path: '/updateCustomer/:customer_id',
    handler: updateCustomer,
  },
  {
    method: 'delete',
    path: '/deleteCustomer/:customer_id',
    handler: deleteCustomer,
  },
  {
    method: 'get',
    path: '/listCustomers/:page/:name_search',
    handler: listCustomers,
  },
  {
    method: 'get',
    path: '/listAllCustomers',
    handler: listAllCustomers,
  },
  { method: 'get', path: '/findByNameCustomer/:name', handler: findByName },
]

export default async (app: FastifyInstance) => {
  for (const route of routesCustomer) {
    app[route.method](route.path, route.handler)
  }
}

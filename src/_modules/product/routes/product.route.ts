/* eslint-disable @typescript-eslint/no-explicit-any */
import { createProduct } from '../controller/create-product.controller'
import { getProduct } from '../controller/get-product.controller'
import { updateProduct } from '../controller/update-product.controller'
import { deleteProduct } from '../controller/delete-product.controller'
import { listProducts } from '../controller/list-products.controller'
import { listAllProducts } from '../controller/list-all-products.controller'
import { FastifyInstance } from 'fastify'
import { findByName } from '../controller/find-by-name-product.controller'
export const routesProduct: {
  method: 'post' | 'get' | 'put' | 'delete'
  path: string
  handler: any
}[] = [
  { method: 'post', path: '/createProduct', handler: createProduct },
  {
    method: 'get',
    path: '/getProduct/:product_id',
    handler: getProduct,
  },
  {
    method: 'put',
    path: '/updateProduct/:product_id',
    handler: updateProduct,
  },
  {
    method: 'delete',
    path: '/deleteProduct/:product_id',
    handler: deleteProduct,
  },
  {
    method: 'get',
    path: '/listProducts/:page/:active/:name_search',
    handler: listProducts,
  },
  {
    method: 'get',
    path: '/listAllProducts/:active',
    handler: listAllProducts,
  },
  { method: 'get', path: '/findByName/:name', handler: findByName },
]

export default async (app: FastifyInstance) => {
  for (const route of routesProduct) {
    app[route.method](route.path, route.handler)
  }
}

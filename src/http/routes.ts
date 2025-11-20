import { checkLive } from '@/_modules/business/controller/check-service.controller'
import businessRoute from '@/_modules/business/routes/business.route'
import { FastifyInstance } from 'fastify'
import authMiddleware from './middlewares/auth'
import planRoute from '@/_modules/plans/routes/plan.route'
import typeBusinessRoute from '@/_modules/type_business/routes/type-business.route'
import userRoute from '@/_modules/user/routes/user.route'
import profissionalRoute from '@/_modules/professional/routes/profissional.route'
import specialtyRoute from '@/_modules/specialty/routes/specialty.route'
import routesProduct from '@/_modules/product/routes/product.route'
import customerRoute from '@/_modules/customer/routes/customer.route'

export const serviceRoutes = async (app: FastifyInstance) => {
  app.get('/checkLiveBusiness', checkLive)
  app.register(async (protectedRoutes) => {
    protectedRoutes.addHook('onRequest', authMiddleware)
    businessRoute(protectedRoutes)
    planRoute(protectedRoutes)
    typeBusinessRoute(protectedRoutes)
    userRoute(protectedRoutes)
    profissionalRoute(protectedRoutes)
    specialtyRoute(protectedRoutes)
    routesProduct(protectedRoutes)
    customerRoute(protectedRoutes)
  })
}

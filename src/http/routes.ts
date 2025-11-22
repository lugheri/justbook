import { checkLive } from '@/_modules/business/controller/check-service.controller'
import businessRoute from '@/_modules/business/routes/business.route'
import { FastifyInstance } from 'fastify'
import authMiddleware from './middlewares/auth'
import planRoute from '@/_modules/plans/routes/plan.route'
import typeBusinessRoute from '@/_modules/type_business/routes/type-business.route'
import profissionalRoute from '@/_modules/professional/routes/profissional.route'
import specialtyRoute from '@/_modules/specialty/routes/specialty.route'
import routesProduct from '@/_modules/product/routes/product.route'
import customerRoute from '@/_modules/customer/routes/customer.route'
import userRoute from '@/_modules/user/routes/user.route'
import { findByEmail } from '@/_modules/user/controller/find-by-email-user.controller'
import { createBusiness } from '@/_modules/business/controller/create-business.controller'
import { createUser } from '@/_modules/user/controller/create-user.controller'
import { authenticate } from '@/_modules/auth/controllers/authenticate.controller'
import authRoutes from '@/_modules/auth/routes/auth.routes'

export const serviceRoutes = async (app: FastifyInstance) => {
  app.get('/checkLiveBusiness', checkLive)
  app.get('/findByEmail/:email', findByEmail)
  app.post('/createAccount', createBusiness)
  app.post('/createNewUser', createUser)
  app.post('/authenticate', authenticate)
  app.register(async (protectedRoutes) => {
    protectedRoutes.addHook('onRequest', authMiddleware)
    authRoutes(protectedRoutes)
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

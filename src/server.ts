import fastify from 'fastify'

import cors from '@fastify/cors'
import { serviceRoutes } from './http/routes'
import { ZodError } from 'zod'
import { env } from './env'

export const app = fastify({
  logger: env.ENVIRONMENT === 'test',
})
app.register(cors, {
  // Configurações CORS aqui
  origin: '*', // Permitir solicitações de qualquer origem (ou especifique a origem desejada)
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
  credentials: true, // Permitir credenciais (cookies, cabeçalhos de autorização, etc.)
})

serviceRoutes(app)
  .then(() => {
    console.log('✅ Routes registered successfully!')
  })
  .catch((err) => {
    console.error('❌ Error registering routes:', err)
    process.exit(1)
  })

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.issues })
  }

  if (env.ENVIRONMENT !== 'production') {
    console.error(error)
  } else {
    // Log external tool
    console.error(error)
  }
  return reply.status(500).send({ message: 'Internal server error.' })
})

app
  .listen({
    host: '0.0.0.0',
    port: env.SERVICE_PORT,
  })
  .then(() => {
    console.log(`JUSTBOOK API 🚀 Running at port  ${env.SERVICE_PORT}`)
  })
  .catch((err) => {
    console.error('JUSTBOOK API ❌ Failed to start:', err)
    process.exit(1)
  })

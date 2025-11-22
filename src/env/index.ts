import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  ENVIRONMENT: z
    .enum(['development', 'test', 'production'])
    .default('production'),
  DATABASE_URL: z.string(),

  DATABASE_HOST: z.string(),
  DATABASE_USER: z.string(),
  DATABASE_PASSWORD: z.string(),
  DATABASE_NAME: z.string(),

  SERVICE_PORT: z.coerce.number().default(10001),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.coerce.number(),
  REDIS_PASS: z.string(),
  APP_SECRET: z.string().default('justbook_dev_jwt_flux'),
})
const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('Invalid environment variables!', _env.error.issues)
  throw new Error('Invalid environmnent variables')
}

export const env = _env.data

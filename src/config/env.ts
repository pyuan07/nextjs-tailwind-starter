import { z } from 'zod'

// Environment validation schema for client-accessible variables
const clientEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  NEXT_PUBLIC_API_BASE_URL: z.string().url().default('http://localhost:3001'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_APP_NAME: z.string().default('React Tailwind Starter'),
  NEXT_PUBLIC_USE_REAL_API: z.preprocess(
    val => val === 'true' || val === true,
    z.boolean().default(false)
  ),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional().or(z.literal('')),
  NEXT_PUBLIC_BUILD_ID: z.string().optional(),
  NEXT_PUBLIC_APP_VERSION: z.string().optional(),
})

// Environment validation schema for server-only variables
const serverEnvSchema = clientEnvSchema
  .extend({
    USE_REAL_API: z.preprocess(
      val => val === 'true' || val === true,
      z.boolean().default(false)
    ),
    JWT_SECRET: z.string().optional(),
  })
  .refine(
    data => {
      if (data.NODE_ENV === 'production' && !data.JWT_SECRET) {
        return false
      }
      return true
    },
    {
      message: 'JWT_SECRET is required in production environments',
      path: ['JWT_SECRET'],
    }
  )

function validateEnv() {
  const isServer = typeof window === 'undefined'

  const envObj = {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_USE_REAL_API: process.env.NEXT_PUBLIC_USE_REAL_API,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    NEXT_PUBLIC_BUILD_ID: process.env.NEXT_PUBLIC_BUILD_ID,
    NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION,
    ...(isServer
      ? {
          USE_REAL_API: process.env.USE_REAL_API,
          JWT_SECRET: process.env.JWT_SECRET,
        }
      : {}),
  }

  const schema = isServer ? serverEnvSchema : clientEnvSchema
  const result = schema.safeParse(envObj)

  if (!result.success) {
    console.error('Environment validation failed:', result.error.format())
    throw new Error('Environment validation failed')
  }

  return result.data
}

// Validate environment on module load
const validatedEnv = validateEnv()

// Export validated and typed environment configuration
export const env = {
  // API Configuration - TypeScript API Server
  API_BASE_URL: validatedEnv.NEXT_PUBLIC_API_BASE_URL,

  // App URL (for CORS and redirects)
  NEXT_PUBLIC_APP_URL: validatedEnv.NEXT_PUBLIC_APP_URL,

  // App Configuration
  APP_NAME: validatedEnv.NEXT_PUBLIC_APP_NAME,

  // Environment Info
  NODE_ENV: validatedEnv.NODE_ENV,
  isDevelopment: validatedEnv.NODE_ENV === 'development',
  isProduction: validatedEnv.NODE_ENV === 'production',
  isTest: validatedEnv.NODE_ENV === 'test',

  // Feature flags
  USE_REAL_API_CLIENT: validatedEnv.NEXT_PUBLIC_USE_REAL_API,

  // Server-only values (safely typed on client, but defaults to fallback values)
  USE_REAL_API_SERVER:
    'USE_REAL_API' in validatedEnv
      ? (validatedEnv as { USE_REAL_API: boolean }).USE_REAL_API
      : false,
  JWT_SECRET:
    'JWT_SECRET' in validatedEnv
      ? (validatedEnv as { JWT_SECRET?: string }).JWT_SECRET
      : undefined,

  // Sentry / monitoring
  SENTRY_DSN: validatedEnv.NEXT_PUBLIC_SENTRY_DSN,
  BUILD_ID: validatedEnv.NEXT_PUBLIC_BUILD_ID,
  APP_VERSION: validatedEnv.NEXT_PUBLIC_APP_VERSION,
} as const

export type Env = typeof env

// Runtime environment check helper
export function checkEnvironmentRequirements(): boolean {
  try {
    // Check if running in browser
    if (typeof window !== 'undefined') {
      // Browser environment checks
      if (!window.localStorage) {
        console.warn('localStorage is not available')
        return false
      }

      if (!window.fetch) {
        console.error('fetch API is not available')
        return false
      }
    }

    return true
  } catch (error) {
    console.error('Environment requirements check failed:', error)
    return false
  }
}

// Development mode helpers
export const isDev = env.isDevelopment
export const isProd = env.isProduction
export const isTest = env.isTest

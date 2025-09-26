// API Configuration for external TypeScript API server
import { env } from './env'
import { logger } from '@/lib/logger'

// API Configuration
export const apiConfig = {
  // Base URL for your TypeScript API server
  baseURL: env.API_BASE_URL || 'http://localhost:3001',

  // API version prefix
  version: '/api/v1',

  // Timeout configuration
  timeout: 30000, // 30 seconds

  // Retry configuration
  retry: {
    attempts: 3,
    delay: 1000, // 1 second
    backoff: 2, // Exponential backoff multiplier
  },

  // Request configuration
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
}

// Helper to build full API URLs
export function buildApiUrl(endpoint: string): string {
  const baseUrl = apiConfig.baseURL.replace(/\/$/, '') // Remove trailing slash
  const version = apiConfig.version.replace(/^\//, '') // Remove leading slash
  const path = endpoint.replace(/^\//, '') // Remove leading slash

  return `${baseUrl}/${version}/${path}`
}

// Environment validation
if (typeof window === 'undefined') {
  // Server-side validation
  if (!env.API_BASE_URL) {
    logger.warn(
      'API_BASE_URL not configured, using default: http://localhost:3001'
    )
  }
}

// Development helpers
export const isDevelopment = process.env.NODE_ENV === 'development'
export const isProduction = process.env.NODE_ENV === 'production'

// API health check endpoint
export const healthCheckUrl = buildApiUrl('/health')

// CORS configuration for development
export const corsConfig = {
  origin: isDevelopment
    ? ['http://localhost:3000', 'http://localhost:3001']
    : [env.NEXT_PUBLIC_APP_URL],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}

import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { rateLimiter } from '@/utils/security'
import { env } from '@/config/env'

/**
 * Error reporting API endpoint
 * Receives client-side errors and forwards to monitoring services
 */

interface ErrorReportPayload {
  error: {
    name: string
    message: string
    stack?: string
  }
  context: {
    userId?: string
    sessionId?: string
    url: string
    userAgent: string
    timestamp: number
    buildId?: string
    version?: string
    environment: string
    component?: string
    action?: string
    extra?: Record<string, unknown>
  }
  level: 'error' | 'warning' | 'info'
  fingerprint?: string[]
  tags?: Record<string, string>
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting by IP address
    const clientIP =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown'
    const isRateLimited = rateLimiter.isRateLimited(
      `error-reporting:${clientIP}`,
      50, // 50 errors per window
      15 * 60 * 1000 // 15 minutes
    )

    if (isRateLimited) {
      logger.warn('Error reporting rate limit exceeded', { clientIP })
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    // Parse and validate request body
    const payload: ErrorReportPayload = await request.json()

    if (!payload.error || !payload.context) {
      return NextResponse.json(
        { error: 'Invalid payload structure' },
        { status: 400 }
      )
    }

    // Sanitize and validate payload
    const sanitizedPayload = {
      error: {
        name: String(payload.error.name || 'UnknownError').substring(0, 200),
        message: String(payload.error.message || 'No message').substring(
          0,
          1000
        ),
        stack: payload.error.stack
          ? String(payload.error.stack).substring(0, 5000)
          : undefined,
      },
      context: {
        userId: payload.context.userId
          ? String(payload.context.userId).substring(0, 100)
          : undefined,
        sessionId: String(payload.context.sessionId || 'unknown').substring(
          0,
          100
        ),
        url: String(payload.context.url || 'unknown').substring(0, 500),
        userAgent: String(payload.context.userAgent || 'unknown').substring(
          0,
          500
        ),
        timestamp: Number(payload.context.timestamp) || Date.now(),
        buildId: payload.context.buildId
          ? String(payload.context.buildId).substring(0, 100)
          : undefined,
        version: payload.context.version
          ? String(payload.context.version).substring(0, 50)
          : undefined,
        environment: String(payload.context.environment || 'unknown').substring(
          0,
          20
        ),
        component: payload.context.component
          ? String(payload.context.component).substring(0, 100)
          : undefined,
        action: payload.context.action
          ? String(payload.context.action).substring(0, 100)
          : undefined,
        extra: payload.context.extra || {},
      },
      level: ['error', 'warning', 'info'].includes(payload.level)
        ? payload.level
        : 'error',
      fingerprint: Array.isArray(payload.fingerprint)
        ? payload.fingerprint.slice(0, 5).map(f => String(f).substring(0, 100))
        : undefined,
      tags: payload.tags || {},
    }

    // Log the error locally
    logger.error(
      'Client error reported',
      new Error(sanitizedPayload.error.message),
      {
        errorReport: sanitizedPayload,
        clientIP,
        timestamp: new Date().toISOString(),
      }
    )

    // Forward to external monitoring services in production
    if (env.isProduction) {
      await Promise.allSettled([
        forwardToSentry(sanitizedPayload),
        forwardToDatadog(sanitizedPayload),
        storeInDatabase(sanitizedPayload),
      ])
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Error report received',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    logger.error('Failed to process error report', error as Error)

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Forward error to Sentry
 */
async function forwardToSentry(payload: ErrorReportPayload): Promise<void> {
  try {
    // Placeholder for Sentry integration
    // In a real app, you would use Sentry.captureException here
    /*
    import * as Sentry from '@sentry/nextjs'

    Sentry.withScope((scope) => {
      scope.setLevel(payload.level as any)
      scope.setContext('error_context', payload.context)
      scope.setFingerprint(payload.fingerprint || [])

      Object.entries(payload.tags || {}).forEach(([key, value]) => {
        scope.setTag(key, value)
      })

      const error = new Error(payload.error.message)
      error.name = payload.error.name
      error.stack = payload.error.stack

      Sentry.captureException(error)
    })
    */

    logger.info('Error forwarded to Sentry (simulated)', {
      errorName: payload.error.name,
      component: payload.context.component,
    })
  } catch (error) {
    logger.warn('Failed to forward error to Sentry', {
      error: (error as Error).message,
    })
  }
}

/**
 * Forward error to Datadog
 */
async function forwardToDatadog(payload: ErrorReportPayload): Promise<void> {
  try {
    // Placeholder for Datadog integration
    // In a real app, you would send to Datadog Logs API
    /*
    await fetch('https://http-intake.logs.datadoghq.com/v1/input/YOUR_API_KEY', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: payload.error.message,
        level: payload.level,
        service: 'nextjs-app',
        tags: payload.tags,
        ...payload.context,
      }),
    })
    */

    logger.info('Error forwarded to Datadog (simulated)', {
      errorName: payload.error.name,
      component: payload.context.component,
    })
  } catch (error) {
    logger.warn('Failed to forward error to Datadog', {
      error: (error as Error).message,
    })
  }
}

/**
 * Store error in database for analysis
 */
async function storeInDatabase(payload: ErrorReportPayload): Promise<void> {
  try {
    // Placeholder for database storage
    // In a real app, you would store in your database
    /*
    await db.errorReports.create({
      data: {
        errorName: payload.error.name,
        errorMessage: payload.error.message,
        errorStack: payload.error.stack,
        userId: payload.context.userId,
        sessionId: payload.context.sessionId,
        url: payload.context.url,
        userAgent: payload.context.userAgent,
        component: payload.context.component,
        action: payload.context.action,
        level: payload.level,
        environment: payload.context.environment,
        tags: payload.tags,
        extra: payload.context.extra,
        createdAt: new Date(payload.context.timestamp),
      },
    })
    */

    logger.info('Error stored in database (simulated)', {
      errorName: payload.error.name,
      component: payload.context.component,
    })
  } catch (error) {
    logger.warn('Failed to store error in database', {
      error: (error as Error).message,
    })
  }
}

/**
 * Health check for error reporting endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'error-reporting',
    timestamp: new Date().toISOString(),
  })
}

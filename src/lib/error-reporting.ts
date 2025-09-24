/**
 * Centralized error reporting service
 * Supports multiple providers: Sentry, LogRocket, custom endpoints
 */

import { logger } from '@/lib/logger'
import { env } from '@/config/env'

export interface ErrorContext {
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

export interface ErrorReport {
  error: Error
  context: ErrorContext
  level: 'error' | 'warning' | 'info'
  fingerprint?: string[]
  tags?: Record<string, string>
}

class ErrorReportingService {
  private isInitialized = false
  private sessionId: string
  private userId?: string

  constructor() {
    this.sessionId = this.generateSessionId()
    this.initialize()
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private initialize(): void {
    if (typeof window === 'undefined') return

    // Initialize Sentry if DSN is provided
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      this.initializeSentry()
    }

    // Initialize other providers as needed
    this.setupGlobalErrorHandlers()
    this.isInitialized = true

    logger.info('Error reporting service initialized', {
      sessionId: this.sessionId,
      environment: env.NODE_ENV,
    })
  }

  private initializeSentry(): void {
    // Placeholder for Sentry initialization
    // In a real app, you would import and configure Sentry here
    /*
    import * as Sentry from '@sentry/nextjs'

    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: env.NODE_ENV,
      tracesSampleRate: env.isProduction ? 0.1 : 1.0,
      beforeSend: (event) => {
        // Filter out non-actionable errors
        if (event.exception?.values?.[0]?.value?.includes('Non-Error promise rejection')) {
          return null
        }
        return event
      },
    })
    */
  }

  private setupGlobalErrorHandlers(): void {
    if (typeof window === 'undefined') return

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', event => {
      this.reportError(
        new Error(`Unhandled Promise Rejection: ${event.reason}`),
        { component: 'Global', action: 'unhandledrejection' }
      )
    })

    // Handle global JavaScript errors
    window.addEventListener('error', event => {
      this.reportError(new Error(event.message), {
        component: 'Global',
        action: 'javascript-error',
        extra: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      })
    })

    // Handle resource loading errors
    window.addEventListener(
      'error',
      event => {
        if (event.target && event.target !== window) {
          const target = event.target as HTMLElement
          this.reportError(
            new Error(`Resource loading failed: ${target.tagName}`),
            {
              component: 'Global',
              action: 'resource-error',
              extra: {
                tagName: target.tagName,
                src:
                  (target as HTMLImageElement | HTMLLinkElement).src ||
                  (target as HTMLLinkElement).href,
              },
            }
          )
        }
      },
      true
    )
  }

  setUserId(userId: string): void {
    this.userId = userId
    logger.info('User ID set for error reporting', { userId })
  }

  clearUserId(): void {
    this.userId = undefined
    logger.info('User ID cleared for error reporting')
  }

  private createErrorContext(
    additionalContext?: Partial<ErrorContext>
  ): ErrorContext {
    const baseContext: ErrorContext = {
      sessionId: this.sessionId,
      userId: this.userId,
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      userAgent:
        typeof window !== 'undefined' ? navigator.userAgent : 'unknown',
      timestamp: Date.now(),
      environment: env.NODE_ENV,
      buildId: process.env.NEXT_PUBLIC_BUILD_ID,
      version: process.env.NEXT_PUBLIC_APP_VERSION,
    }

    return { ...baseContext, ...additionalContext }
  }

  reportError(
    error: Error,
    additionalContext?: Partial<ErrorContext>,
    level: ErrorReport['level'] = 'error'
  ): void {
    try {
      const context = this.createErrorContext(additionalContext)
      const report: ErrorReport = {
        error,
        context,
        level,
        fingerprint: this.generateFingerprint(error, context),
        tags: {
          component: context.component || 'unknown',
          environment: context.environment,
        },
      }

      // Log locally
      logger.error('Error reported', error, { context })

      // Send to external services
      this.sendToSentry(report)
      this.sendToCustomEndpoint(report)
    } catch (reportingError) {
      logger.error('Failed to report error', reportingError as Error, {
        originalError: error.message,
      })
    }
  }

  private generateFingerprint(error: Error, context: ErrorContext): string[] {
    return [
      error.name,
      error.message.replace(/\d+/g, 'N'), // Replace numbers for grouping
      context.component || 'unknown',
    ]
  }

  private sendToSentry(report: ErrorReport): void {
    // Placeholder for Sentry reporting
    // In a real app, you would use Sentry.captureException here
    /*
    Sentry.withScope((scope) => {
      scope.setLevel(report.level)
      scope.setContext('error_context', report.context)
      scope.setFingerprint(report.fingerprint)

      Object.entries(report.tags || {}).forEach(([key, value]) => {
        scope.setTag(key, value)
      })

      Sentry.captureException(report.error)
    })
    */

    if (env.isDevelopment) {
      console.log('Sentry report (dev mode):', report)
    }
  }

  private async sendToCustomEndpoint(report: ErrorReport): Promise<void> {
    // Send to custom error reporting endpoint
    if (!env.isProduction) return

    try {
      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: {
            name: report.error.name,
            message: report.error.message,
            stack: report.error.stack,
          },
          context: report.context,
          level: report.level,
          fingerprint: report.fingerprint,
          tags: report.tags,
        }),
      })
    } catch (networkError) {
      // Don't throw errors from error reporting
      logger.warn('Failed to send error report to custom endpoint', {
        error: (networkError as Error).message,
      })
    }
  }

  // Performance monitoring
  reportPerformanceIssue(
    metricName: string,
    value: number,
    threshold: number,
    additionalContext?: Partial<ErrorContext>
  ): void {
    if (value > threshold) {
      this.reportError(
        new Error(
          `Performance issue: ${metricName} (${value}ms > ${threshold}ms)`
        ),
        {
          ...additionalContext,
          component: 'Performance',
          action: metricName,
          extra: { value, threshold },
        },
        'warning'
      )
    }
  }

  // Network error reporting
  reportNetworkError(
    url: string,
    status: number,
    statusText: string,
    additionalContext?: Partial<ErrorContext>
  ): void {
    this.reportError(
      new Error(`Network error: ${status} ${statusText} for ${url}`),
      {
        ...additionalContext,
        component: 'Network',
        action: 'fetch-error',
        extra: { url, status, statusText },
      },
      status >= 500 ? 'error' : 'warning'
    )
  }
}

// Singleton instance
export const errorReporting = new ErrorReportingService()

// React Error Boundary integration
export function useErrorReporting() {
  return {
    reportError: errorReporting.reportError.bind(errorReporting),
    setUserId: errorReporting.setUserId.bind(errorReporting),
    clearUserId: errorReporting.clearUserId.bind(errorReporting),
    reportPerformanceIssue:
      errorReporting.reportPerformanceIssue.bind(errorReporting),
    reportNetworkError: errorReporting.reportNetworkError.bind(errorReporting),
  }
}

// Helper for manual error reporting
export function captureError(
  error: Error,
  context?: Partial<ErrorContext>
): void {
  errorReporting.reportError(error, context)
}

// Helper for capturing exceptions with context
export function captureException(
  error: unknown,
  context?: Partial<ErrorContext>
): void {
  const errorObj = error instanceof Error ? error : new Error(String(error))

  errorReporting.reportError(errorObj, context)
}

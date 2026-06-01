'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from './button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './card'
import {
  AlertTriangle,
  RefreshCw,
  Send,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { logger } from '@/lib/logger'
import { errorReporting } from '@/lib/error-reporting'
import { env } from '@/config/env'

interface Props {
  children?: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  componentName?: string
  userId?: string
  resetOnPropsChange?: boolean
  isolate?: boolean
  title?: string
  description?: string
  tryAgainLabel?: string
  reloadLabel?: string
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
  errorId?: string
  retryCount: number
  showDetails: boolean
  feedbackSent: boolean
}

/**
 * Enhanced error boundary component with comprehensive error reporting
 */
export class ErrorBoundary extends Component<Props, State> {
  private maxRetries = 3

  public state: State = {
    hasError: false,
    retryCount: 0,
    showDetails: false,
    feedbackSent: false,
  }

  public static getDerivedStateFromError(error: Error): State {
    const uniquePart =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID().replace(/-/g, '').substring(0, 9)
        : Math.random().toString(36).substring(2, 9)
    const errorId = `err_${Date.now()}_${uniquePart}`
    return {
      hasError: true,
      error,
      errorId,
      retryCount: 0,
      showDetails: false,
      feedbackSent: false,
    }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorId = this.state.errorId || 'unknown'

    // Enhanced logging with more context
    logger.error('Error boundary caught an error:', error, {
      errorId,
      componentStack: errorInfo.componentStack,
      componentName: this.props.componentName,
      userId: this.props.userId,
      retryCount: this.state.retryCount,
      timestamp: new Date().toISOString(),
    })

    // Report to error tracking service
    errorReporting.reportError(error, {
      component: this.props.componentName || 'ErrorBoundary',
      action: 'component-error',
      extra: {
        errorId,
        componentStack: errorInfo.componentStack,
        retryCount: this.state.retryCount,
        isolate: this.props.isolate,
      },
    })

    // Set error info in state
    this.setState({ errorInfo })

    // Call parent error handler
    this.props.onError?.(error, errorInfo)
  }

  public componentDidUpdate(prevProps: Props) {
    // Reset error state when props change (if enabled)
    if (
      this.props.resetOnPropsChange &&
      this.state.hasError &&
      prevProps.children !== this.props.children
    ) {
      this.setState({
        hasError: false,
        error: undefined,
        errorInfo: undefined,
        retryCount: 0,
        showDetails: false,
        feedbackSent: false,
      })
    }
  }

  private handleRetry = () => {
    if (this.state.retryCount >= this.maxRetries) {
      logger.warn('Max retry attempts reached', {
        errorId: this.state.errorId,
        retryCount: this.state.retryCount,
      })
      return
    }

    this.setState(prevState => ({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      retryCount: prevState.retryCount + 1,
      showDetails: false,
      feedbackSent: false,
    }))

    logger.info('Error boundary retry attempted', {
      errorId: this.state.errorId,
      retryCount: this.state.retryCount + 1,
    })
  }

  private handleReload = () => {
    logger.info('Page reload triggered from error boundary', {
      errorId: this.state.errorId,
    })
    window.location.reload()
  }

  private toggleDetails = () => {
    this.setState(prevState => ({ showDetails: !prevState.showDetails }))
  }

  private sendFeedback = async () => {
    try {
      if (!this.state.error) return

      // Report user-initiated feedback
      errorReporting.reportError(this.state.error, {
        component: this.props.componentName || 'ErrorBoundary',
        action: 'user-feedback',
        extra: {
          errorId: this.state.errorId,
          userInitiated: true,
          retryCount: this.state.retryCount,
        },
      })

      this.setState({ feedbackSent: true })

      logger.info('User feedback sent for error', {
        errorId: this.state.errorId,
      })
    } catch (error) {
      logger.error('Failed to send error feedback', error as Error)
    }
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      const canRetry = this.state.retryCount < this.maxRetries
      const errorMessage = this.state.error?.message || 'Unknown error occurred'
      const titleText = this.props.title ?? 'Something went wrong'
      const descriptionText =
        this.props.description ??
        (canRetry
          ? 'An unexpected error occurred. You can try again or reload the page.'
          : 'An unexpected error occurred. Please reload the page or contact support.')
      const tryAgainText = this.props.tryAgainLabel ?? 'Try Again'
      const reloadText = this.props.reloadLabel ?? 'Reload Page'

      return (
        <div
          className={`${this.props.isolate ? 'p-4' : 'min-h-screen'} flex items-center justify-center p-4`}
        >
          <Card className='w-full max-w-lg'>
            <CardHeader className='text-center'>
              <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10'>
                <AlertTriangle className='h-6 w-6 text-destructive' />
              </div>
              <CardTitle className='text-xl'>{titleText}</CardTitle>
              <CardDescription className='space-y-2'>
                <p>{descriptionText}</p>
                {this.state.errorId && (
                  <p className='text-xs text-muted-foreground'>
                    Error ID: {this.state.errorId}
                  </p>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {/* Error Details (Development or when toggled) */}
              {(env.isDevelopment || this.state.showDetails) &&
                this.state.error && (
                  <div className='space-y-2'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={this.toggleDetails}
                      className='w-full justify-between'
                    >
                      Error Details
                      {this.state.showDetails ? (
                        <ChevronUp className='h-4 w-4' />
                      ) : (
                        <ChevronDown className='h-4 w-4' />
                      )}
                    </Button>
                    {this.state.showDetails && (
                      <div className='rounded border bg-muted p-3 space-y-2'>
                        <div>
                          <p className='text-xs font-semibold text-muted-foreground mb-1'>
                            Error Message:
                          </p>
                          <p className='text-sm font-mono break-words'>
                            {errorMessage}
                          </p>
                        </div>
                        {this.state.error.stack && (
                          <div>
                            <p className='text-xs font-semibold text-muted-foreground mb-1'>
                              Stack Trace:
                            </p>
                            <pre className='text-xs font-mono text-muted-foreground overflow-auto max-h-32 whitespace-pre-wrap'>
                              {this.state.error.stack}
                            </pre>
                          </div>
                        )}
                        {this.state.retryCount > 0 && (
                          <p className='text-xs text-muted-foreground'>
                            Retry attempts: {this.state.retryCount}/
                            {this.maxRetries}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

              {/* Action Buttons */}
              <div className='space-y-2'>
                <div className='flex gap-2'>
                  {canRetry && (
                    <Button
                      onClick={this.handleRetry}
                      className='flex-1'
                      size='sm'
                    >
                      <RefreshCw className='mr-2 h-4 w-4' />
                      {tryAgainText} ({this.maxRetries - this.state.retryCount}{' '}
                      left)
                    </Button>
                  )}
                  <Button
                    onClick={this.handleReload}
                    variant={canRetry ? 'outline' : 'default'}
                    className='flex-1'
                    size='sm'
                  >
                    {reloadText}
                  </Button>
                </div>

                {/* Error Reporting */}
                {!env.isDevelopment && (
                  <Button
                    onClick={this.sendFeedback}
                    variant='ghost'
                    size='sm'
                    className='w-full'
                    disabled={this.state.feedbackSent}
                  >
                    <Send className='mr-2 h-4 w-4' />
                    {this.state.feedbackSent ? 'Feedback Sent' : 'Report Error'}
                  </Button>
                )}

                {/* Development Toggle */}
                {env.isDevelopment && !this.state.showDetails && (
                  <Button
                    onClick={this.toggleDetails}
                    variant='ghost'
                    size='sm'
                    className='w-full'
                  >
                    Show Error Details
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Hook-based error boundary wrapper for easier usage
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    fallback?: ReactNode
    componentName?: string
    isolate?: boolean
    resetOnPropsChange?: boolean
  }
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary
      fallback={options?.fallback}
      componentName={
        options?.componentName || Component.displayName || Component.name
      }
      isolate={options?.isolate}
      resetOnPropsChange={options?.resetOnPropsChange}
    >
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`

  return WrappedComponent
}

/**
 * React hook for manual error throwing
 * Useful for async errors that don't naturally bubble up to error boundaries
 */
export function useErrorHandler() {
  const [, setError] = React.useState<Error | null>(null)

  return React.useCallback((error: Error) => {
    setError(() => {
      throw error
    })
  }, [])
}

/**
 * Component-level error boundary for specific UI sections
 */
export function SectionErrorBoundary({
  children,
  title = 'Section Error',
  description = 'This section encountered an error and cannot be displayed.',
  componentName,
}: {
  children: ReactNode
  title?: string
  description?: string
  componentName?: string
}) {
  return (
    <ErrorBoundary
      componentName={componentName}
      isolate
      fallback={
        <Card className='w-full'>
          <CardContent className='pt-6'>
            <div className='flex items-center gap-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10'>
                <AlertTriangle className='h-5 w-5 text-destructive' />
              </div>
              <div>
                <h3 className='font-semibold'>{title}</h3>
                <p className='text-sm text-muted-foreground'>{description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      }
    >
      {children}
    </ErrorBoundary>
  )
}

/**
 * Async boundary for handling promise-based errors
 */
export function AsyncErrorBoundary({
  children,
  componentName,
}: {
  children: ReactNode
  componentName?: string
}) {
  const errorHandler = useErrorHandler()

  React.useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason instanceof Error) {
        errorHandler(event.reason)
      } else {
        errorHandler(new Error(`Unhandled promise rejection: ${event.reason}`))
      }
    }

    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [errorHandler])

  return <ErrorBoundary componentName={componentName}>{children}</ErrorBoundary>
}

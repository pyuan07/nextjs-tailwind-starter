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
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { logger } from '@/lib/logger'

interface Props {
  children?: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error?: Error
}

/**
 * Global error boundary component for catching and displaying React errors
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('Error boundary caught an error:', error, {
      componentStack: errorInfo.componentStack,
    })

    this.props.onError?.(error, errorInfo)
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined })
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className='min-h-screen flex items-center justify-center p-4'>
          <Card className='w-full max-w-md'>
            <CardHeader className='text-center'>
              <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10'>
                <AlertTriangle className='h-6 w-6 text-destructive' />
              </div>
              <CardTitle className='text-xl'>Something went wrong</CardTitle>
              <CardDescription>
                An unexpected error occurred. Please try refreshing the page or
                contact support if the problem persists.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className='rounded border bg-muted p-3'>
                  <p className='text-sm font-mono text-muted-foreground'>
                    {this.state.error.message}
                  </p>
                </div>
              )}
              <div className='flex gap-2'>
                <Button onClick={this.handleRetry} className='flex-1' size='sm'>
                  <RefreshCw className='mr-2 h-4 w-4' />
                  Try Again
                </Button>
                <Button
                  onClick={() => window.location.reload()}
                  variant='outline'
                  className='flex-1'
                  size='sm'
                >
                  Reload Page
                </Button>
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
  errorFallback?: ReactNode
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={errorFallback}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`

  return WrappedComponent
}

/**
 * Higher-Order Function for Service Error Handling
 * Eliminates repetitive try-catch blocks across services
 */

import { logger } from '@/lib/logger'
import { getErrorMessage } from '@/utils/helpers'

interface ErrorHandlingOptions {
  /** Service name for logging */
  serviceName: string

  /** Operation name for logging */
  operationName?: string

  /** Custom error message */
  errorMessage?: string

  /** Whether to rethrow the error */
  rethrow?: boolean

  /** Custom error transformer */
  transformError?: (error: unknown) => Error

  /** Callback on error */
  onError?: (error: Error) => void

  /** Additional context for logging */
  context?: Record<string, unknown>
}

/**
 * Wraps an async function with error handling
 * Automatically logs errors and provides consistent error handling
 *
 * @example
 * ```typescript
 * const safeLogin = withErrorHandling(
 *   async (credentials) => {
 *     // Just business logic, no try-catch needed
 *     return await api.post('/auth/login', credentials)
 *   },
 *   {
 *     serviceName: 'AuthService',
 *     operationName: 'login',
 *     context: { email: credentials.email }
 *   }
 * )
 * ```
 */
export function withErrorHandling<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>,
  options: ErrorHandlingOptions
): (...args: TArgs) => Promise<TReturn | null> {
  const {
    serviceName,
    operationName,
    errorMessage,
    rethrow = true,
    transformError,
    onError,
    context = {},
  } = options

  return async (...args: TArgs): Promise<TReturn | null> => {
    const operation = operationName || fn.name || 'unknown'

    try {
      logger.info(`${serviceName}.${operation} started`, context)
      const result = await fn(...args)
      logger.info(`${serviceName}.${operation} completed`, context)
      return result
    } catch (error) {
      // Transform error if transformer provided
      const processedError = transformError
        ? transformError(error)
        : error instanceof Error
          ? error
          : new Error(getErrorMessage(error))

      // Log the error
      logger.error(
        `${serviceName}.${operation} failed`,
        processedError,
        context
      )

      // Call error callback if provided
      onError?.(processedError)

      // Throw with custom message or rethrow original
      if (rethrow) {
        if (errorMessage) {
          throw new Error(errorMessage)
        }
        throw processedError
      }

      // rethrow: false — return null instead of throwing
      return null
    }
  }
}

/**
 * Creates a configured error handler for a specific service
 * Reduces boilerplate when creating multiple wrapped functions
 *
 * @example
 * ```typescript
 * const authErrorHandler = createServiceErrorHandler('AuthService')
 *
 * export const authService = {
 *   login: authErrorHandler(
 *     async (credentials) => { ... },
 *     { operationName: 'login' }
 *   ),
 *   register: authErrorHandler(
 *     async (userData) => { ... },
 *     { operationName: 'register' }
 *   )
 * }
 * ```
 */
export function createServiceErrorHandler(serviceName: string) {
  return <TArgs extends unknown[], TReturn>(
    fn: (...args: TArgs) => Promise<TReturn>,
    options: Omit<ErrorHandlingOptions, 'serviceName'>
  ): ((...args: TArgs) => Promise<TReturn | null>) => {
    return withErrorHandling(fn, { ...options, serviceName })
  }
}

/**
 * Decorator-style error handler for class methods
 * Use with TypeScript decorators or manual wrapping
 *
 * @example
 * ```typescript
 * class UserService {
 *   constructor() {
 *     this.getUsers = serviceMethod(this.getUsers.bind(this), {
 *       serviceName: 'UserService',
 *       operationName: 'getUsers'
 *     })
 *   }
 *
 *   async getUsers() {
 *     // Method implementation
 *   }
 * }
 * ```
 */
export function serviceMethod<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>,
  options: ErrorHandlingOptions
): (...args: TArgs) => Promise<TReturn | null> {
  return withErrorHandling(fn, options)
}

/**
 * Batch error handler for multiple service methods
 * Wraps all methods of a service object with error handling
 *
 * @example
 * ```typescript
 * const rawService = {
 *   async getUsers() { ... },
 *   async createUser(data) { ... },
 *   async deleteUser(id) { ... }
 * }
 *
 * export const userService = withServiceErrorHandling(rawService, 'UserService')
 * ```
 */
export function withServiceErrorHandling<
  T extends Record<string, (...args: unknown[]) => Promise<unknown>>,
>(service: T, serviceName: string): T {
  const wrappedService = {} as T

  for (const [methodName, method] of Object.entries(service)) {
    if (typeof method === 'function') {
      wrappedService[methodName as keyof T] = withErrorHandling(method, {
        serviceName,
        operationName: methodName,
      }) as T[keyof T]
    }
  }

  return wrappedService
}

/**
 * Retry wrapper with exponential backoff
 * Combines error handling with automatic retries
 *
 * @example
 * ```typescript
 * const fetchWithRetry = withRetry(
 *   async () => api.get('/users'),
 *   {
 *     serviceName: 'UserService',
 *     maxRetries: 3,
 *     retryDelay: 1000,
 *     backoffMultiplier: 2
 *   }
 * )
 * ```
 */
export function withRetry<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>,
  options: ErrorHandlingOptions & {
    maxRetries?: number
    retryDelay?: number
    backoffMultiplier?: number
    shouldRetry?: (error: Error, attempt: number) => boolean
  }
): (...args: TArgs) => Promise<TReturn> {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    backoffMultiplier = 2,
    shouldRetry = () => true,
    ...errorOptions
  } = options

  return async (...args: TArgs): Promise<TReturn> => {
    let lastError: Error | undefined
    let attempt = 0

    while (attempt <= maxRetries) {
      try {
        const result = await withErrorHandling(fn, {
          ...errorOptions,
          context: {
            ...errorOptions.context,
            attempt: attempt + 1,
            maxRetries,
          },
          rethrow: attempt === maxRetries, // Only rethrow on last attempt
        })(...args)

        // null means rethrow:false swallowed an error — treat as retry signal
        if (result !== null) {
          return result as TReturn
        }

        lastError = new Error('Operation returned null')
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error))

        // Don't retry if this was the last attempt
        if (attempt === maxRetries) {
          throw lastError
        }

        // Check if we should retry this error
        if (!shouldRetry(lastError, attempt)) {
          throw lastError
        }

        // Calculate delay with exponential backoff
        const delay = retryDelay * Math.pow(backoffMultiplier, attempt)

        logger.warn(
          `${options.serviceName}.${options.operationName} retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`,
          {
            error: lastError.message,
            attempt: attempt + 1,
            maxRetries,
          }
        )

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay))

        attempt++
      }
    }

    // This should never be reached, but TypeScript needs it
    throw lastError || new Error('Retry failed')
  }
}

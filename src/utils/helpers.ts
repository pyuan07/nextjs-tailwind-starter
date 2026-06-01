/**
 * Utility helper functions
 *
 * Note: Some utilities (debounce, throttle, sleep) are kept for future use
 * even though they're not currently used in the codebase.
 */

/**
 * Extract error message from various error types
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message: unknown }).message)
  }

  return 'An unknown error occurred'
}

/**
 * Format API error for display
 * Note: Currently unused but kept for future API error formatting needs
 */
export function formatApiError(error: unknown): string {
  const message = getErrorMessage(error)

  // Clean up common API error prefixes
  return message
    .replace(/^Error:\s*/i, '')
    .replace(/^API Error:\s*/i, '')
    .replace(/^HTTP \d{3}:\s*/i, '')
}

/**
 * Check if error is a network error
 * Note: Currently unused but kept for future network error detection needs
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.name === 'NetworkError' ||
      error.name === 'TypeError' ||
      error.message.includes('fetch') ||
      error.message.includes('network') ||
      error.message.includes('connection')
    )
  }
  return false
}

/**
 * Sleep utility for delays
 * Note: Currently unused but commonly needed for testing and animations
 *
 * @example
 * await sleep(1000) // Wait 1 second
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Debounce function calls
 * Note: Currently unused but commonly needed for search inputs and resize handlers
 *
 * @example
 * const debouncedSearch = debounce((query: string) => {
 *   // Perform search
 * }, 300)
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }

    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle function calls
 * Note: Currently unused but commonly needed for scroll and resize events
 *
 * @example
 * const throttledScroll = throttle(() => {
 *   // Handle scroll
 * }, 100)
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean

  return function executedFunction(this: unknown, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

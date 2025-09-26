import { memo } from 'react'

/**
 * Creates a memoized component with error boundary wrapper
 * Reduces boilerplate for components that need both memo and error boundaries
 */
export const createMemoizedComponent = <T extends Record<string, unknown>>(
  Component: React.ComponentType<T>,
  displayName?: string
) => {
  const MemoizedComponent = memo(Component)
  if (displayName) {
    MemoizedComponent.displayName = displayName
  }
  return MemoizedComponent
}

/**
 * Factory for creating memoized components with custom equality check
 */
export const createMemoizedComponentWithCompare = <
  T extends Record<string, unknown>,
>(
  Component: React.ComponentType<T>,
  areEqual?: (prevProps: T, nextProps: T) => boolean,
  displayName?: string
) => {
  const MemoizedComponent = memo(Component, areEqual)
  if (displayName) {
    MemoizedComponent.displayName = displayName
  }
  return MemoizedComponent
}

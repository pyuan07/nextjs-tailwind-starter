// Simplified API hook - replaces complex useQuery/useUsers hooks
import { useState, useEffect, useCallback } from 'react'

interface ApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

/**
 * Simple, unified API hook for data fetching
 * Replaces the complex useQuery pattern with something easy to understand
 */
export function useApi<T = unknown>(
  fetcher: () => Promise<{ data?: T } | T>
): ApiState<T> {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: true,
    error: null,
  })

  const memoizedFetcher = useCallback(fetcher, [])

  useEffect(() => {
    let isCancelled = false

    const fetchData = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }))
        const response = await memoizedFetcher()

        if (!isCancelled) {
          const data =
            response && typeof response === 'object' && 'data' in response
              ? (response as { data: T }).data
              : (response as T)
          setState({
            data: data || null,
            loading: false,
            error: null,
          })
        }
      } catch (error) {
        if (!isCancelled) {
          setState({
            data: null,
            loading: false,
            error: error instanceof Error ? error.message : 'An error occurred',
          })
        }
      }
    }

    fetchData()

    return () => {
      isCancelled = true
    }
  }, [memoizedFetcher])

  return state
}

/**
 * Simple mutation hook for API calls that modify data
 */
export function useMutation<TResult = unknown, TParams = unknown>() {
  const [state, setState] = useState<{
    loading: boolean
    error: string | null
  }>({
    loading: false,
    error: null,
  })

  const mutate = async (
    mutationFn: (params: TParams) => Promise<TResult>,
    params: TParams
  ) => {
    try {
      setState({ loading: true, error: null })
      const result = await mutationFn(params)
      setState({ loading: false, error: null })
      return result
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Mutation failed'
      setState({ loading: false, error: errorMessage })
      throw error
    }
  }

  return {
    ...state,
    mutate,
  }
}

// Common utility types used across the application

// Generic ID types
export type ID = string | number

// Generic entity base
export interface BaseEntity {
  id: ID
  createdAt?: Date
  updatedAt?: Date
}

// Generic form state
export interface FormState {
  isLoading: boolean
  error: string | null
  success: boolean
}

// Generic async state
export interface AsyncState<T = unknown> {
  data: T | null
  loading: boolean
  error: string | null
}

// Environment types
export type Environment = 'development' | 'production' | 'test'

// Generic callback types
export type VoidCallback = () => void
export type AsyncCallback = () => Promise<void>
export type ErrorCallback = (error: Error) => void

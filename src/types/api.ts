// Consolidated API types - all API-related types in one place

// ============================================================================
// COMMON API TYPES
// ============================================================================

/**
 * Standard API response wrapper (for your TypeScript API server)
 * Uses discriminated union for type safety
 */
export type ApiResponse<T = unknown> =
  | {
      success: true
      data: T
      message?: string
    }
  | {
      success: false
      error: ApiError
      message: string
    }

/**
 * API error structure with discriminated types
 */
export type ApiError =
  | {
      type: 'validation'
      message: string
      field: string
      code: string
    }
  | {
      type: 'authentication'
      message: string
      code: 'UNAUTHORIZED' | 'TOKEN_EXPIRED' | 'INVALID_TOKEN'
    }
  | {
      type: 'authorization'
      message: string
      code: 'FORBIDDEN' | 'INSUFFICIENT_PERMISSIONS'
    }
  | {
      type: 'not_found'
      message: string
      resource: string
    }
  | {
      type: 'server'
      message: string
      code?: string
      status?: number
    }

// Pagination types
export interface PaginationParams {
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Common query parameters
export interface QueryParams extends PaginationParams {
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// ============================================================================
// AUTHENTICATION TYPES
// ============================================================================

// Request DTOs
export interface LoginRequest {
  email: string
  password: string
  remember?: boolean
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface UpdateUserRequest {
  name?: string
  email?: string
  avatar?: string
  currentPassword?: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  password: string
  confirmPassword: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface VerifyEmailRequest {
  token: string
}

// Token types (matching your TypeScript API server)
export interface TokenPair {
  accessToken: string
  refreshToken: string
  accessTokenExpiry: number // Unix timestamp
  refreshTokenExpiry: number // Unix timestamp
  tokenType: 'Bearer'
}

// API response format from your TypeScript server
export interface AuthTokens {
  access: {
    token: string
    expires: string
  }
  refresh: {
    token: string
    expires: string
  }
}

// User data schema (matching Prisma schema)
export interface User {
  id: string | number
  email: string
  name: string
  avatar?: string | null
  role: 'user' | 'admin' | 'moderator'
  lang: 'en' | 'zh' | 'ms'
  isEmailVerified: boolean
  createdAt: string
  updatedAt: string
}

// Response DTOs from your TypeScript API
export interface LoginResponse {
  user: User
  tokens: AuthTokens
}

export interface RegisterResponse {
  user: User
  tokens: AuthTokens
}

export interface ProfileResponse {
  user: User
}

export interface RefreshTokenResponse {
  tokens: AuthTokens
}

// Internal token storage structure
export interface StoredTokenInfo {
  accessToken: string
  accessTokenExpiry: number
  // Refresh token stored in httpOnly cookie, not here
}

// Token validation result
export interface TokenValidation {
  isValid: boolean
  isExpired: boolean
  expiresIn: number // seconds until expiry
  needsRefresh: boolean // true if expires in < 5 minutes
}

// ============================================================================
// USER MANAGEMENT TYPES
// ============================================================================

export interface UserProfile extends User {
  preferences?: Record<string, unknown>
}

export interface UpdateProfileRequest {
  name?: string
  email?: string
  avatar?: string
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Discriminated union for service responses with data
 * Provides better type safety - TypeScript knows data exists when success is true
 *
 * @example
 * ```typescript
 * const response = await authService.login(credentials)
 * if (response.success) {
 *   // TypeScript knows response.data exists here
 *   console.log(response.data.user)
 * } else {
 *   // TypeScript knows response.errors exists here
 *   console.error(response.errors)
 * }
 * ```
 */
export type ServiceResponse<T = unknown> =
  | {
      success: true
      message: string
      data: T
    }
  | {
      success: false
      message: string
      errors: string[]
    }

/**
 * Service response for operations that don't return data
 * Use this for logout, delete, etc.
 */
export type VoidServiceResponse =
  | {
      success: true
      message: string
    }
  | {
      success: false
      message: string
      errors: string[]
    }

// API endpoint configuration
export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  path: string
  requiresAuth?: boolean
}

// Request configuration
export interface RequestConfig extends Omit<RequestInit, 'body'> {
  timeout?: number
  retries?: number
  body?: unknown
  params?: Record<string, string | number | boolean>
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Type guard for API errors (discriminated union)
 */
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'type' in error &&
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string'
  )
}

/**
 * Type guard for successful service response
 */
export function isSuccessResponse<T>(
  response: ServiceResponse<T>
): response is Extract<ServiceResponse<T>, { success: true }> {
  return response.success === true
}

/**
 * Type guard for error service response
 */
export function isErrorResponse<T>(
  response: ServiceResponse<T>
): response is Extract<ServiceResponse<T>, { success: false }> {
  return response.success === false
}

export function isTokenPair(obj: unknown): obj is TokenPair {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'accessToken' in obj &&
    'refreshToken' in obj &&
    'accessTokenExpiry' in obj &&
    'refreshTokenExpiry' in obj &&
    'tokenType' in obj
  )
}

export function isUser(obj: unknown): obj is User {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'email' in obj &&
    'name' in obj &&
    'role' in obj &&
    'isEmailVerified' in obj
  )
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const PASSWORD_MIN_LENGTH = 8

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email)
}

export function isValidPassword(password: string): boolean {
  return password.length >= PASSWORD_MIN_LENGTH
}

// ============================================================================
// API ENDPOINTS (matching your TypeScript server routes)
// ============================================================================

export const API_ENDPOINTS = {
  // Authentication
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh-tokens',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    verifyEmail: '/auth/verify-email',
    sendVerification: '/auth/send-verification-email',
  },
  // Users
  users: {
    profile: '/users/profile',
    updateProfile: '/users/profile',
    changePassword: '/users/change-password',
  },
  // Health check
  health: '/health',
} as const

// Extract endpoint keys for type safety
export type AuthEndpoint = keyof typeof API_ENDPOINTS.auth
export type UserEndpoint = keyof typeof API_ENDPOINTS.users

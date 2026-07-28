/**
 * Authentication Service
 * Provides a unified interface for authentication operations
 *
 * SCOPE: Used for register, resetPassword, verifyEmail, updateProfile.
 * Login / logout / session are handled via tokenManager -> /api/auth/* routes.
 *
 * CONFIGURATION:
 * - Currently using MockAuthService for standalone operation
 * - To use a real API server, replace MockAuthService with API calls
 */

import { api } from '@/lib/api'
import { tokenManager } from '@/utils/auth/tokenManager'
import { logger } from '@/lib/logger'
import { MockAuthService } from './mock-auth.service'
import type {
  LoginRequest,
  RegisterRequest,
  UpdateUserRequest,
  RegisterResponse,
  AuthTokens,
  TokenPair,
  User,
  ServiceResponse,
  VoidServiceResponse,
} from '@/types/api'
import { API_ENDPOINTS } from '@/types/api'
import { USE_REAL_API_CLIENT as USE_REAL_API } from '@/constants/config'

// Convert API token format to internal format
function convertTokens(apiTokens: AuthTokens): TokenPair {
  return {
    accessToken: apiTokens.access.token,
    refreshToken: apiTokens.refresh.token,
    accessTokenExpiry: new Date(apiTokens.access.expires).getTime(),
    refreshTokenExpiry: new Date(apiTokens.refresh.expires).getTime(),
    tokenType: 'Bearer',
  }
}

// Auth service using centralized API client or mock
export const authService = {
  /**
   * User login
   * Uses MockAuthService by default for standalone operation
   */
  async login(
    credentials: LoginRequest
  ): Promise<ServiceResponse<{ user: User; tokens: TokenPair }>> {
    // Use mock service for standalone operation
    if (!USE_REAL_API) {
      return MockAuthService.login(credentials)
    }

    // Real API implementation
    try {
      logger.info('Attempting login', { email: credentials.email })

      const response = await api.post<{ user: User; tokens: AuthTokens }>(
        API_ENDPOINTS.auth.login,
        credentials
      )

      // Convert API tokens to internal format.
      // Tokens are persisted server-side as HttpOnly cookies by the
      // /api/auth/* route handlers — nothing to store on the client.
      const tokens = convertTokens(response.tokens)

      logger.info('Login successful', { userId: String(response.user.id) })

      return {
        success: true,
        message: 'Login successful',
        data: {
          user: response.user,
          tokens,
        },
      }
    } catch (error) {
      logger.error('Login failed', error as Error, {
        email: credentials.email,
      })
      throw new Error(error instanceof Error ? error.message : 'Login failed')
    }
  },

  /**
   * User registration
   */
  async register(
    userData: RegisterRequest
  ): Promise<ServiceResponse<{ user: User; tokens: TokenPair }>> {
    // Use mock service for standalone operation
    if (!USE_REAL_API) {
      return MockAuthService.register(userData)
    }

    // Real API implementation
    try {
      logger.info('Attempting registration', {
        email: userData.email,
        name: userData.name,
      })

      const response = await api.post<RegisterResponse>(
        API_ENDPOINTS.auth.register,
        userData
      )

      // Convert API tokens to internal format (persisted server-side as
      // HttpOnly cookies — nothing to store on the client).
      const tokens = convertTokens(response.tokens)

      logger.info('Registration successful', {
        userId: String(response.user.id),
      })

      return {
        success: true,
        message: 'Registration successful',
        data: {
          user: response.user,
          tokens,
        },
      }
    } catch (error) {
      logger.error('Registration failed', error as Error, {
        email: userData.email,
      })
      throw new Error(
        error instanceof Error ? error.message : 'Registration failed'
      )
    }
  },

  /**
   * User logout
   */
  async logout(): Promise<VoidServiceResponse> {
    // Use mock service for standalone operation
    if (!USE_REAL_API) {
      return MockAuthService.logout()
    }

    // Real API implementation
    try {
      // Get refresh token for server logout
      const refreshToken = tokenManager.getRefreshTokenFromCookie()

      if (refreshToken) {
        logger.info('Attempting logout with server token invalidation')

        await api.post(API_ENDPOINTS.auth.logout, {
          refreshToken: refreshToken,
        })

        logger.info('Server logout successful')
      } else {
        logger.warn('No refresh token found, performing local logout only')
      }

      // Clear tokens locally
      tokenManager.clearTokens()

      return {
        success: true,
        message: 'Logged out successfully',
      }
    } catch (error) {
      // Even if server logout fails, clear local tokens
      logger.error(
        'Server logout failed, clearing local tokens',
        error as Error
      )
      tokenManager.clearTokens()
      throw new Error(error instanceof Error ? error.message : 'Logout failed')
    }
  },

  /**
   * Get user profile
   */
  async getProfile(): Promise<ServiceResponse<User>> {
    // Use mock service for standalone operation
    if (!USE_REAL_API) {
      return MockAuthService.getProfile()
    }

    // Real API implementation.
    //
    // Routed through the same-origin /api/user/profile handler rather than
    // calling the external API directly: the access token is HttpOnly, so the
    // browser cannot attach a bearer itself. The route reads the cookie and
    // forwards the bearer server-side.
    try {
      logger.info('Fetching user profile')

      const user = await tokenManager.getProfile()

      logger.info('Profile retrieved successfully', {
        userId: String(user.id),
      })

      return {
        success: true,
        message: 'Profile retrieved',
        data: user,
      }
    } catch (error) {
      logger.error('Failed to get profile', error as Error)
      throw new Error(
        error instanceof Error ? error.message : 'Failed to get profile'
      )
    }
  },

  /**
   * Update user profile
   */
  async updateProfile(
    updates: UpdateUserRequest
  ): Promise<ServiceResponse<User>> {
    // Use mock service for standalone operation
    if (!USE_REAL_API) {
      return MockAuthService.updateProfile(updates)
    }

    // Real API implementation — via the same-origin proxy route, see getProfile.
    try {
      logger.info('Updating user profile', { updates: Object.keys(updates) })

      const user = await tokenManager.updateProfile(updates)

      logger.info('Profile updated successfully', {
        userId: String(user.id),
      })

      return {
        success: true,
        message: 'Profile updated',
        data: user,
      }
    } catch (error) {
      logger.error('Profile update failed', error as Error)
      throw new Error(error instanceof Error ? error.message : 'Update failed')
    }
  },

  /**
   * Refresh authentication tokens
   */
  async refreshToken(): Promise<ServiceResponse<{ tokens: TokenPair }>> {
    try {
      logger.info('Attempting token refresh')

      const newTokens = await tokenManager.refreshAccessToken()
      if (!newTokens) {
        throw new Error('Failed to refresh token')
      }

      logger.info('Token refresh successful')

      return {
        success: true,
        message: 'Token refreshed successfully',
        data: { tokens: newTokens },
      }
    } catch (error) {
      logger.error('Token refresh failed', error as Error)
      throw new Error(
        error instanceof Error ? error.message : 'Token refresh failed'
      )
    }
  },

  /**
   * Request password reset
   */
  async forgotPassword(email: string): Promise<VoidServiceResponse> {
    try {
      logger.info('Requesting password reset', { email })

      await api.post(API_ENDPOINTS.auth.forgotPassword, { email })

      logger.info('Password reset email sent', { email })

      return {
        success: true,
        message: 'Password reset email sent',
      }
    } catch (error) {
      logger.error('Forgot password failed', error as Error, { email })
      throw new Error(
        error instanceof Error ? error.message : 'Failed to send reset email'
      )
    }
  },

  /**
   * Reset password with token
   */
  async resetPassword(
    token: string,
    password: string
  ): Promise<VoidServiceResponse> {
    try {
      logger.info('Attempting password reset')

      await api.post(API_ENDPOINTS.auth.resetPassword, { token, password })

      logger.info('Password reset successful')

      return {
        success: true,
        message: 'Password reset successful',
      }
    } catch (error) {
      logger.error('Password reset failed', error as Error)
      throw new Error(
        error instanceof Error ? error.message : 'Password reset failed'
      )
    }
  },

  /**
   * Send email verification
   */
  async sendVerificationEmail(): Promise<VoidServiceResponse> {
    try {
      if (!tokenManager.isAuthenticated()) {
        throw new Error('Not authenticated')
      }

      logger.info('Sending verification email')

      await api.post(API_ENDPOINTS.auth.sendVerification)

      logger.info('Verification email sent')

      return {
        success: true,
        message: 'Verification email sent',
      }
    } catch (error) {
      logger.error('Failed to send verification email', error as Error)
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Failed to send verification email'
      )
    }
  },

  /**
   * Verify email with token
   */
  async verifyEmail(token: string): Promise<VoidServiceResponse> {
    try {
      logger.info('Attempting email verification')

      await api.post(API_ENDPOINTS.auth.verifyEmail, { token })

      logger.info('Email verification successful')

      return {
        success: true,
        message: 'Email verified successfully',
      }
    } catch (error) {
      logger.error('Email verification failed', error as Error)
      throw new Error(
        error instanceof Error ? error.message : 'Email verification failed'
      )
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return tokenManager.isAuthenticated()
  },

  /**
   * Get token status
   */
  getTokenStatus() {
    const validation = tokenManager.validateAccessToken()
    return {
      isAuthenticated: tokenManager.isAuthenticated(),
      tokenValidation: validation,
    }
  },
}

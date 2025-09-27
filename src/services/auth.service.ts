// Clean auth service using centralized API client
import { api } from '@/lib/api'
import { tokenManager } from '@/utils/auth/tokenManager'
import { logger } from '@/lib/logger'
import type {
  LoginRequest,
  RegisterRequest,
  UpdateUserRequest,
  RegisterResponse,
  ProfileResponse,
  AuthTokens,
  TokenPair,
  User,
  ServiceResponse,
} from '@/types/api'
import { API_ENDPOINTS } from '@/types/api'

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

// Auth service using centralized API client
export const authService = {
  /**
   * User login - TEMPORARY HARDCODED FOR DEBUGGING
   */
  async login(
    credentials: LoginRequest
  ): Promise<ServiceResponse<{ user: User; tokens: TokenPair }>> {
    try {
      logger.info('Attempting login (HARDCODED)', { email: credentials.email })

      // Hardcoded validation for debugging
      if (
        credentials.email === 'demo@example.com' &&
        credentials.password === 'password'
      ) {
        // Create mock tokens
        const tokens: TokenPair = {
          accessToken: 'mock-access-token-' + Date.now(),
          refreshToken: 'mock-refresh-token-' + Date.now(),
          accessTokenExpiry: Date.now() + 60 * 60 * 1000, // 1 hour
          refreshTokenExpiry: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
          tokenType: 'Bearer',
        }

        // Mock user data
        const user: User = {
          id: 1,
          email: 'demo@example.com',
          name: 'Demo User',
          isEmailVerified: true,
          role: 'user',
          lang: 'en',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        // Store tokens securely
        tokenManager.storeTokens(tokens)

        logger.info('Login successful (HARDCODED)', { userId: String(user.id) })

        return {
          success: true,
          message: 'Login successful (HARDCODED)',
          data: {
            user,
            tokens,
          },
        }
      } else {
        throw new Error(
          'Invalid credentials (only demo@example.com / password works)'
        )
      }
    } catch (error) {
      logger.error('Login failed (HARDCODED)', error as Error, {
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
    try {
      logger.info('Attempting registration', {
        email: userData.email,
        name: userData.name,
      })

      const response = await api.post<RegisterResponse>(
        API_ENDPOINTS.auth.register,
        userData
      )

      // Convert API tokens to internal format
      const tokens = convertTokens(response.tokens)

      // Store tokens securely
      tokenManager.storeTokens(tokens)

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
  async logout(): Promise<ServiceResponse> {
    try {
      // Get refresh token for server logout
      const refreshToken =
        (
          tokenManager as unknown as {
            getRefreshTokenFromCookie?: () => string | null
          }
        ).getRefreshTokenFromCookie?.() || localStorage.getItem('refresh_token')

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
   * Get user profile - TEMPORARY HARDCODED FOR DEBUGGING
   */
  async getProfile(): Promise<ServiceResponse<User>> {
    try {
      if (!tokenManager.isAuthenticated()) {
        throw new Error('Not authenticated')
      }

      logger.info('Fetching user profile (HARDCODED)')

      // Mock user data
      const user: User = {
        id: 1,
        email: 'demo@example.com',
        name: 'Demo User',
        lang: 'en',
        isEmailVerified: true,
        role: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      logger.info('Profile retrieved successfully (HARDCODED)', {
        userId: String(user.id),
      })

      return {
        success: true,
        message: 'Profile retrieved (HARDCODED)',
        data: user,
      }
    } catch (error) {
      logger.error('Failed to get profile (HARDCODED)', error as Error)
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
    try {
      if (!tokenManager.isAuthenticated()) {
        throw new Error('Not authenticated')
      }

      logger.info('Updating user profile', { updates: Object.keys(updates) })

      const response = await api.patch<ProfileResponse>(
        API_ENDPOINTS.users.updateProfile,
        updates
      )

      logger.info('Profile updated successfully', {
        userId: String(response.user.id),
      })

      return {
        success: true,
        message: 'Profile updated',
        data: response.user,
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
  async forgotPassword(email: string): Promise<ServiceResponse> {
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
  ): Promise<ServiceResponse> {
    try {
      logger.info('Attempting password reset')

      await api.post(`${API_ENDPOINTS.auth.resetPassword}?token=${token}`, {
        password,
      })

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
  async sendVerificationEmail(): Promise<ServiceResponse> {
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
  async verifyEmail(token: string): Promise<ServiceResponse> {
    try {
      logger.info('Attempting email verification')

      await api.post(`${API_ENDPOINTS.auth.verifyEmail}?token=${token}`)

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

/**
 * Mock Authentication Service
 * Provides hardcoded authentication for standalone operation without an API server
 * This allows the starter to work out-of-the-box for development and demos
 */

import { logger } from '@/lib/logger'
import { tokenManager } from '@/utils/auth/tokenManager'
import { DEMO_CONFIG, TOKEN_CONFIG } from '@/constants'
import type {
  LoginRequest,
  RegisterRequest,
  UpdateUserRequest,
  User,
  TokenPair,
  ServiceResponse,
  VoidServiceResponse,
} from '@/types/api'

/**
 * Mock user database (in-memory)
 */
class MockUserDatabase {
  private users: Map<string, User> = new Map()

  constructor() {
    // Initialize with demo user
    const demoUser: User = {
      ...DEMO_CONFIG.DEMO_USER,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      avatar: null,
    }
    this.users.set(demoUser.email, demoUser)
  }

  findByEmail(email: string): User | undefined {
    return this.users.get(email)
  }

  findById(id: string | number): User | undefined {
    return Array.from(this.users.values()).find(user => user.id === id)
  }

  create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
    const newUser: User = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.users.set(newUser.email, newUser)
    return newUser
  }

  update(id: string | number, data: Partial<User>): User | undefined {
    const user = this.findById(id)
    if (!user) return undefined

    const updatedUser: User = {
      ...user,
      ...data,
      id: user.id, // Don't allow ID changes
      updatedAt: new Date().toISOString(),
    }

    // Update email index if email changed
    if (data.email && data.email !== user.email) {
      this.users.delete(user.email)
      this.users.set(updatedUser.email, updatedUser)
    } else {
      this.users.set(updatedUser.email, updatedUser)
    }

    return updatedUser
  }

  exists(email: string): boolean {
    return this.users.has(email)
  }
}

// Singleton database instance
const mockDB = new MockUserDatabase()

/**
 * Generate mock JWT-like tokens
 */
function generateMockTokens(): TokenPair {
  const now = Date.now()
  const randomId = crypto.randomUUID().replace(/-/g, '').substring(0, 13)

  return {
    accessToken: `mock_access_${now}_${randomId}`,
    refreshToken: `mock_refresh_${now}_${randomId}`,
    accessTokenExpiry: now + TOKEN_CONFIG.ACCESS_TOKEN_LIFETIME,
    refreshTokenExpiry: now + TOKEN_CONFIG.REFRESH_TOKEN_LIFETIME,
    tokenType: 'Bearer',
  }
}

/**
 * Simulate network delay for realistic behavior
 */
async function simulateNetworkDelay(ms: number = 500): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Mock Authentication Service
 * Mimics real API behavior for standalone development
 */
export const MockAuthService = {
  /**
   * Mock user login
   */
  async login(
    credentials: LoginRequest
  ): Promise<ServiceResponse<{ user: User; tokens: TokenPair }>> {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'MockAuthService is not available in production. Set USE_REAL_API=true.'
      )
    }
    await simulateNetworkDelay()

    try {
      logger.info('Mock login attempt', { email: credentials.email })

      // Validate credentials
      const user = mockDB.findByEmail(credentials.email)

      if (!user) {
        throw new Error('User not found. Try demo@example.com')
      }

      // In a real app, you'd verify the password hash
      // For mock: only the known demo password is accepted (kept out of shared config)
      const DEMO_PASSWORD = 'password'
      if (
        credentials.email === DEMO_CONFIG.DEMO_USER.email &&
        credentials.password !== DEMO_PASSWORD
      ) {
        throw new Error('Invalid password. Try: password')
      }

      // Generate tokens
      const tokens = generateMockTokens()

      // Store tokens
      tokenManager.storeTokens(tokens)

      logger.info('Mock login successful', { userId: String(user.id) })

      return {
        success: true,
        message: 'Login successful (MOCK)',
        data: { user, tokens },
      }
    } catch (error) {
      logger.error('Mock login failed', error as Error, {
        email: credentials.email,
      })
      throw error
    }
  },

  /**
   * Mock user registration
   */
  async register(
    userData: RegisterRequest
  ): Promise<ServiceResponse<{ user: User; tokens: TokenPair }>> {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'MockAuthService is not available in production. Set USE_REAL_API=true.'
      )
    }
    await simulateNetworkDelay()

    try {
      logger.info('Mock registration attempt', { email: userData.email })

      // Validate passwords match
      if (userData.password !== userData.confirmPassword) {
        throw new Error('Passwords do not match')
      }

      // Check if user already exists
      if (mockDB.exists(userData.email)) {
        throw new Error('User already exists with this email')
      }

      // Create new user
      const newUser = mockDB.create({
        email: userData.email,
        name: userData.name,
        role: 'user',
        lang: 'en',
        isEmailVerified: false,
        avatar: null,
      })

      // Generate tokens
      const tokens = generateMockTokens()

      // Store tokens
      tokenManager.storeTokens(tokens)

      logger.info('Mock registration successful', {
        userId: String(newUser.id),
      })

      return {
        success: true,
        message: 'Registration successful (MOCK)',
        data: { user: newUser, tokens },
      }
    } catch (error) {
      logger.error('Mock registration failed', error as Error, {
        email: userData.email,
      })
      throw error
    }
  },

  /**
   * Mock logout
   */
  async logout(): Promise<VoidServiceResponse> {
    await simulateNetworkDelay(200)

    try {
      logger.info('Mock logout')
      tokenManager.clearTokens()

      return {
        success: true,
        message: 'Logged out successfully (MOCK)',
      }
    } catch (error) {
      logger.error('Mock logout failed', error as Error)
      throw error
    }
  },

  /**
   * Mock get user profile
   */
  async getProfile(): Promise<ServiceResponse<User>> {
    await simulateNetworkDelay(300)

    try {
      if (!tokenManager.isAuthenticated()) {
        throw new Error('Not authenticated')
      }

      // In a real app, you'd decode the JWT to get user ID
      // For mock: return demo user
      const user = mockDB.findByEmail(DEMO_CONFIG.DEMO_USER.email)

      if (!user) {
        throw new Error('User not found')
      }

      logger.info('Mock profile retrieved', { userId: String(user.id) })

      return {
        success: true,
        message: 'Profile retrieved (MOCK)',
        data: user,
      }
    } catch (error) {
      logger.error('Mock get profile failed', error as Error)
      throw error
    }
  },

  /**
   * Mock update user profile
   */
  async updateProfile(
    updates: UpdateUserRequest
  ): Promise<ServiceResponse<User>> {
    await simulateNetworkDelay(400)

    try {
      if (!tokenManager.isAuthenticated()) {
        throw new Error('Not authenticated')
      }

      const currentUser = mockDB.findByEmail(DEMO_CONFIG.DEMO_USER.email)
      if (!currentUser) {
        throw new Error('User not found')
      }

      // Update user
      const updatedUser = mockDB.update(currentUser.id, updates)

      if (!updatedUser) {
        throw new Error('Failed to update profile')
      }

      logger.info('Mock profile updated', { userId: String(updatedUser.id) })

      return {
        success: true,
        message: 'Profile updated (MOCK)',
        data: updatedUser,
      }
    } catch (error) {
      logger.error('Mock profile update failed', error as Error)
      throw error
    }
  },

  /**
   * Mock token refresh
   */
  async refreshToken(): Promise<ServiceResponse<{ tokens: TokenPair }>> {
    await simulateNetworkDelay(200)

    try {
      logger.info('Mock token refresh')

      // Generate new tokens
      const tokens = generateMockTokens()

      logger.info('Mock token refresh successful')

      return {
        success: true,
        message: 'Token refreshed (MOCK)',
        data: { tokens },
      }
    } catch (error) {
      logger.error('Mock token refresh failed', error as Error)
      throw error
    }
  },

  /**
   * Mock forgot password
   */
  async forgotPassword(email: string): Promise<VoidServiceResponse> {
    await simulateNetworkDelay(500)

    try {
      logger.info('Mock forgot password request', { email })

      const user = mockDB.findByEmail(email)
      if (!user) {
        // Don't reveal if user exists (security best practice)
        logger.warn('Forgot password for non-existent user', { email })
      }

      return {
        success: true,
        message: 'Password reset email sent (MOCK)',
      }
    } catch (error) {
      logger.error('Mock forgot password failed', error as Error)
      throw error
    }
  },

  /**
   * Mock reset password
   */
  async resetPassword(
    _token: string,
    _password: string
  ): Promise<VoidServiceResponse> {
    await simulateNetworkDelay(400)

    try {
      logger.info('Mock password reset')

      // In a real app, you'd validate the reset token
      // For mock: just pretend it worked
      return {
        success: true,
        message: 'Password reset successful (MOCK)',
      }
    } catch (error) {
      logger.error('Mock password reset failed', error as Error)
      throw error
    }
  },

  /**
   * Mock send verification email
   */
  async sendVerificationEmail(): Promise<VoidServiceResponse> {
    await simulateNetworkDelay(300)

    try {
      if (!tokenManager.isAuthenticated()) {
        throw new Error('Not authenticated')
      }

      logger.info('Mock verification email sent')

      return {
        success: true,
        message: 'Verification email sent (MOCK)',
      }
    } catch (error) {
      logger.error('Mock send verification failed', error as Error)
      throw error
    }
  },

  /**
   * Mock verify email
   */
  async verifyEmail(_token: string): Promise<VoidServiceResponse> {
    await simulateNetworkDelay(300)

    try {
      logger.info('Mock email verification')

      // In a real app, you'd validate the verification token
      // For mock: just pretend it worked
      return {
        success: true,
        message: 'Email verified successfully (MOCK)',
      }
    } catch (error) {
      logger.error('Mock email verification failed', error as Error)
      throw error
    }
  },

  /**
   * Check if authenticated
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

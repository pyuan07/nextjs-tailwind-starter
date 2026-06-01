// Centralized services exports
export { authService } from './auth.service'
export { userService } from './user.service'

// Export types for convenience
export type {
  LoginRequest,
  RegisterRequest,
  UpdateUserRequest,
  User,
  ServiceResponse,
} from '@/types/api'

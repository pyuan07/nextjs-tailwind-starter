// Centralized hooks exports with named exports for clarity

// Auth hooks (Zustand-based)
export { useAuth, useAuthStatus } from './use-auth'

// Theme hooks
export { useTheme } from './use-theme'

// Toast hook
export { useToast } from './use-toast'

// API hooks
export { useApi, useMutation } from './api/useApi'

// Export types for convenience
export type { User, LoginRequest, RegisterRequest } from '@/types/api'

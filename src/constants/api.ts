// Simplified API constants - essential endpoints only
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
    REGISTER: '/auth/register',
  },
  USERS: {
    LIST: '/users',
    DETAIL: (id: string | number) => `/users/${id}`,
  },
} as const

// Common HTTP status codes (only the ones we actually use)
export const HTTP_STATUS = {
  OK: 200,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const

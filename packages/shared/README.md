# Shared Package

A TypeScript package containing shared code, types, services, and utilities used across web and mobile applications in this monorepo.

## 🎯 Purpose

This package provides a single source of truth for:

- **Business Logic** - Services and API clients
- **Type Definitions** - TypeScript interfaces and types
- **State Management** - Zustand stores
- **Utilities** - Common helper functions
- **Validation** - Zod schemas for data validation
- **Constants** - Shared configuration and constants

## 📁 Package Structure

```
src/
├── constants/           # Shared constants and configuration
│   ├── api.ts          # API endpoints and configuration
│   └── index.ts        # Re-exports all constants
├── docs/               # Package documentation
│   ├── api-examples.md # API usage examples
│   └── README.md       # Package overview
├── hooks/              # Shared React hooks
│   └── use-auth.ts     # Authentication hook
├── services/           # API services and business logic
│   ├── authService.ts  # Authentication API service
│   ├── userService.ts  # User management API service
│   └── index.ts        # Re-exports all services
├── stores/             # Zustand state stores
│   ├── auth-store.ts   # Authentication state management
│   └── index.ts        # Re-exports all stores
├── types/              # TypeScript type definitions
│   ├── api/           # API-related types
│   │   ├── auth.ts     # Authentication types
│   │   ├── common.ts   # Common API types
│   │   ├── users.ts    # User-related types
│   │   └── index.ts    # Re-exports API types
│   ├── common/        # Common utility types
│   │   ├── utility.ts  # Generic utility types
│   │   └── index.ts    # Re-exports common types
│   ├── entities/      # Business entity types
│   │   ├── user.ts     # User entity types
│   │   └── index.ts    # Re-exports entity types
│   ├── ui/            # UI-related types
│   │   ├── theme.ts    # Theme and styling types
│   │   └── index.ts    # Re-exports UI types
│   └── index.ts       # Re-exports all types
├── utils/             # Utility functions
│   ├── api/           # API-related utilities
│   │   ├── client.ts   # HTTP client configuration
│   │   ├── helpers.ts  # API helper functions
│   │   └── index.ts    # Re-exports API utils
│   ├── auth/          # Authentication utilities
│   │   └── tokenManager.ts # Token management utilities
│   ├── security.ts    # Security utilities
│   ├── validation.ts  # Validation schemas (Zod)
│   └── index.ts       # Re-exports all utilities
└── index.ts           # Main package entry point
```

## 🚀 Installation & Usage

### Internal Package Usage

This package is automatically installed as a local dependency in both web and mobile apps:

```json
// In apps/web/package.json and apps/mobile/package.json
{
  "dependencies": {
    "shared": "file:../../packages/shared"
  }
}
```

### Importing from Shared Package

```typescript
// Import types
import type { User, LoginRequest, ApiResponse } from "shared/types";

// Import services
import { authService, userService } from "shared/services";

// Import hooks
import { useAuth } from "shared/hooks";

// Import stores
import { useAuthStore } from "shared/stores";

// Import utilities
import { validateEmail, formatDate } from "shared/utils";

// Import constants
import { API_ENDPOINTS } from "shared/constants";
```

### TypeScript Path Mapping

For better imports, configure path mapping in your app's `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "shared/*": ["../../packages/shared/src/*"],
      "shared": ["../../packages/shared/src/index.ts"]
    }
  }
}
```

## 📋 API Documentation

### Authentication Service

```typescript
import { authService } from "shared/services";

// Login user
const loginResult = await authService.login({
  email: "user@example.com",
  password: "password123",
});

// Register user
const registerResult = await authService.register({
  name: "John Doe",
  email: "john@example.com",
  password: "password123",
});

// Logout user
await authService.logout();

// Refresh token
const newTokens = await authService.refreshToken();

// Reset password
await authService.resetPassword("user@example.com");
```

### User Service

```typescript
import { userService } from "shared/services";

// Get user profile
const user = await userService.getProfile();

// Update user profile
const updatedUser = await userService.updateProfile({
  name: "Jane Doe",
  email: "jane@example.com",
});

// Get users list (admin)
const users = await userService.getUsers();

// Delete user (admin)
await userService.deleteUser("user-id");
```

### Authentication Store

```typescript
import { useAuthStore } from 'shared/stores';

function MyComponent() {
  const {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth
  } = useAuthStore();

  const handleLogin = async () => {
    try {
      await login({
        email: 'demo@example.com',
        password: 'password'
      });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Authentication Hook

```typescript
import { useAuth } from "shared/hooks";

function ProfileComponent() {
  const { user, isAuthenticated, login, logout, isLoading } = useAuth();

  // Hook provides the same interface as the store
  // but with additional React-specific optimizations
}
```

## 🔧 Type Definitions

### User Types

```typescript
// User entity
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

// User role enumeration
type UserRole = "admin" | "user" | "moderator";

// User profile update payload
interface UpdateUserRequest {
  name?: string;
  email?: string;
  avatar?: string;
}
```

### Authentication Types

```typescript
// Login request payload
interface LoginRequest {
  email: string;
  password: string;
  remember?: boolean;
}

// Registration request payload
interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

// Authentication response
interface AuthResponse {
  user: User;
  tokens: TokenPair;
  message: string;
}

// Token pair
interface TokenPair {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiry: string;
  refreshTokenExpiry: string;
}
```

### API Types

```typescript
// Generic API response wrapper
interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message: string;
  errors?: string[];
}

// API error response
interface ApiError {
  success: false;
  message: string;
  errors: string[];
  statusCode: number;
}

// Pagination metadata
interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Paginated response
interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
```

## 🛠️ Utilities

### Validation Schemas (Zod)

```typescript
import { z } from "zod";

// Email validation
export const emailSchema = z
  .string()
  .email("Invalid email address")
  .min(1, "Email is required");

// Password validation
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

// Login form validation
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
});

// Registration form validation
export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
```

### API Client

```typescript
import { apiClient } from "shared/utils/api";

// HTTP client with interceptors
const response = await apiClient.get("/users");
const user = await apiClient.post("/auth/login", loginData);

// Automatic token handling
// Automatic request/response logging
// Error handling and retries
```

### Security Utilities

```typescript
import {
  sanitizeInput,
  validateCSRF,
  hashPassword,
  generateRandomString,
} from "shared/utils/security";

// Input sanitization
const cleanInput = sanitizeInput(userInput);

// CSRF validation
const isValidCSRF = validateCSRF(token);

// Password hashing (for demonstration)
const hashedPassword = await hashPassword("password123");

// Random string generation
const sessionId = generateRandomString(32);
```

## 📚 Constants

### API Configuration

```typescript
// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    RESET_PASSWORD: "/auth/reset-password",
  },
  USERS: {
    PROFILE: "/users/profile",
    UPDATE_PROFILE: "/users/profile",
    LIST: "/users",
    DELETE: (id: string) => `/users/${id}`,
  },
  HEALTH: "/health",
} as const;

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Application constants
export const APP_CONFIG = {
  TOKEN_REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes
  MAX_RETRY_ATTEMPTS: 3,
  REQUEST_TIMEOUT: 10000, // 10 seconds
  PAGE_SIZE: 20,
} as const;
```

## 🧪 Testing

### Unit Testing

```bash
# Run tests for shared package
npm run test           # Run all tests
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Generate coverage report
```

### Test Structure (to be implemented)

```
__tests__/
├── services/          # Service tests
│   ├── authService.test.ts
│   └── userService.test.ts
├── stores/           # Store tests
│   └── auth-store.test.ts
├── utils/            # Utility tests
│   ├── validation.test.ts
│   └── security.test.ts
└── types/            # Type tests
    └── api.test.ts
```

### Example Test

```typescript
// __tests__/services/authService.test.ts
import { authService } from "../src/services";
import { LoginRequest } from "../src/types";

describe("AuthService", () => {
  test("should login successfully with valid credentials", async () => {
    const loginData: LoginRequest = {
      email: "demo@example.com",
      password: "password",
    };

    const result = await authService.login(loginData);

    expect(result.success).toBe(true);
    expect(result.data.user).toBeDefined();
    expect(result.data.tokens).toBeDefined();
  });
});
```

## 🔧 Development

### Building the Package

```bash
# TypeScript compilation
npm run typecheck        # Check types without emitting

# Linting
npm run lint            # Run ESLint
npm run lint:fix        # Fix linting issues

# Cleaning
npm run clean:deps      # Clean node_modules
```

### Adding New Features

1. **Add types** in appropriate `types/` subdirectory
2. **Implement services** in `services/` directory
3. **Create utilities** in `utils/` directory
4. **Update exports** in `index.ts` files
5. **Write tests** for new functionality
6. **Update documentation**

### Best Practices

- **Export everything** through `index.ts` files
- **Use TypeScript strictly** with proper type definitions
- **Follow naming conventions** for consistency
- **Write comprehensive tests** for all public APIs
- **Document all public functions** with JSDoc comments
- **Keep dependencies minimal** to avoid bloating apps

## 🤝 Contributing

1. All shared code should be platform-agnostic
2. Use TypeScript for everything
3. Follow the established folder structure
4. Add proper type definitions for all exports
5. Write tests for new functionality
6. Update documentation when adding features

## 📝 Related Documentation

- [Root README](../../README.md) - Monorepo overview
- [GUIDE](../../GUIDE.md) - Comprehensive development guide
- [Web App](../../apps/web/README.md) - Next.js web app documentation
- [Mobile App](../../apps/mobile/README.md) - React Native app documentation
- [API Examples](./src/docs/api-examples.md) - Detailed API usage examples

---

**This package is the foundation for sharing code across your monorepo! 🚀**

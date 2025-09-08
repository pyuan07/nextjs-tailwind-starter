# Shared Package Documentation

This directory contains documentation for the shared package used across web and mobile apps.

## Structure

- `api-examples.md` - API usage examples and interface documentation
- `migration-guide.md` - Guide for migrating between versions
- `troubleshooting.md` - Common issues and solutions

## Quick Start

```typescript
// Import everything from the main entry point
import {
  authService,
  userService,
  useAuth,
  apiClient,
  validateEmail,
} from "shared";

// Or import specific modules
import { useAuth } from "shared/hooks";
import { authService } from "shared/services";
```

## Available Modules

### Services

- `authService` - Authentication operations
- `userService` - User management operations

### Hooks

- `useAuth` - Authentication state and operations

### Stores

- `authStore` - Global authentication state (Zustand)

### Utilities

- `apiClient` - HTTP client with auth handling
- `validateEmail` - Email validation
- `validatePassword` - Password validation
- `tokenManager` - JWT token management

### Types

- Complete TypeScript definitions for all APIs
- Common utility types
- UI theme types

## Development

See `api-examples.md` for detailed usage examples.

## Contributing

When adding new shared functionality:

1. Add TypeScript types in `src/types/`
2. Implement in appropriate module (`services/`, `hooks/`, etc.)
3. Export from `src/index.ts`
4. Document in `api-examples.md`
5. Test in both web and mobile apps

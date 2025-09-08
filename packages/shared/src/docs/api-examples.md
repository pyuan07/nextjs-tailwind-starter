# API Documentation Examples

This file contains example API documentation structure for the shared services.

## Authentication API

### Login

```typescript
// Usage Example
import { authService } from "shared";

const result = await authService.login({
  email: "user@example.com",
  password: "password123",
});
```

**Request:**

```typescript
interface LoginRequest {
  email: string;
  password: string;
}
```

**Response:**

```typescript
interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
```

### Get User Profile

```typescript
// Usage Example
const user = await userService.getProfile();
```

**Response:**

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}
```

## Shared Hooks

### useAuth Hook

```typescript
// Usage Example in React components
import { useAuth } from 'shared';

function MyComponent() {
  const { user, login, logout, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {user ? (
        <div>
          Welcome {user.name}
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={() => login(credentials)}>Login</button>
      )}
    </div>
  );
}
```

## Shared Stores (Zustand)

### Auth Store

```typescript
// Usage Example
import { useAuthStore } from "shared";

// In component
const { user, setUser, clearUser } = useAuthStore();

// Outside component
import { authStore } from "shared";
authStore.getState().setUser(newUser);
```

## Utility Functions

### API Client

```typescript
// Usage Example
import { apiClient } from "shared";

// GET request
const users = await apiClient.get<User[]>("/users");

// POST request
const newUser = await apiClient.post<User>("/users", userData);

// With error handling
try {
  const result = await apiClient.get("/protected-route");
} catch (error) {
  if (error.status === 401) {
    // Handle unauthorized
  }
}
```

### Validation Utilities

```typescript
// Usage Example
import { validateEmail, validatePassword } from "shared";

const emailError = validateEmail("test@example.com");
const passwordError = validatePassword("mypassword123");

if (emailError || passwordError) {
  // Handle validation errors
}
```

---

## TODO: Complete Documentation

- [ ] Add more detailed examples for each service
- [ ] Document error handling patterns
- [ ] Add TypeScript interface documentation
- [ ] Include configuration examples
- [ ] Add testing examples
- [ ] Document mobile-specific adaptations

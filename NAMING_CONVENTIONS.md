# Naming Conventions

This document defines the file and code naming conventions used throughout the project for consistency.

## 📁 File Naming

### React Components

**Convention:** `PascalCase.tsx`

```
✅ LoginForm.tsx
✅ UserProfile.tsx
✅ AuthGuard.tsx
❌ loginForm.tsx
❌ login-form.tsx
```

**Reason:** React components are classes/functions that return JSX, so they use PascalCase matching JavaScript class conventions.

---

### TypeScript Files (Non-Components)

**Convention:** `kebab-case.ts`

```
✅ auth.service.ts
✅ user.service.ts
✅ cookie-manager.ts
✅ with-error-handling.ts
✅ auth-store.ts
✅ error-reporting.ts
❌ AuthService.ts
❌ cookieManager.ts
❌ withErrorHandling.ts
```

**Reason:** Kebab-case is the standard for non-component files in modern TypeScript projects. It's URL-friendly and consistent with npm package naming.

---

### Special Suffixes

#### Services

**Pattern:** `{name}.service.ts`

```
✅ auth.service.ts → exports authService
✅ user.service.ts → exports userService
✅ mock-auth.service.ts → exports MockAuthService
```

#### Stores (Zustand/Redux)

**Pattern:** `{name}-store.ts`

```
✅ auth-store.ts → exports useAuthStore
✅ user-store.ts → exports useUserStore
```

#### Types/Interfaces

**Pattern:** `{name}.types.ts` or `{name}.ts` in `/types` folder

```
✅ api.ts (in types folder)
✅ i18n.ts (in types folder)
```

---

## 💻 Code Naming

### Exported Classes

**Convention:** `PascalCase`

```typescript
✅ export class CookieManager { ... }
✅ export class ApiClient { ... }
✅ export class RateLimiter { ... }
❌ export class cookieManager { ... }
```

---

### Exported Objects/Services

**Convention:** `camelCase`

```typescript
✅ export const authService = { ... }
✅ export const userService = { ... }
✅ export const MockAuthService = { ... }  // Exception: kept for clarity
❌ export const AuthService = { ... }
```

---

### Exported Functions

**Convention:** `camelCase`

```typescript
✅ export function getErrorMessage() { ... }
✅ export function sanitizeHtml() { ... }
✅ export function withErrorHandling() { ... }
❌ export function GetErrorMessage() { ... }
```

---

### Constants

**Convention:** `SCREAMING_SNAKE_CASE`

```typescript
✅ export const API_ENDPOINTS = { ... }
✅ export const TOKEN_CONFIG = { ... }
✅ export const RATE_LIMITS = { ... }
❌ export const apiEndpoints = { ... }
```

---

### React Components

**Convention:** `PascalCase`

```typescript
✅ export function LoginForm() { ... }
✅ export const UserProfile = () => { ... }
✅ export default function HomePage() { ... }
❌ export function loginForm() { ... }
```

---

### Custom Hooks

**Convention:** `use{Name}` in `camelCase`

```typescript
✅ export function useAuth() { ... }
✅ export function useAuthStatus() { ... }
✅ export function useTheme() { ... }
❌ export function UseAuth() { ... }
❌ export function authHook() { ... }
```

---

### Types and Interfaces

**Convention:** `PascalCase`

```typescript
✅ export interface User { ... }
✅ export type ServiceResponse<T> = ...
✅ export interface LoginRequest { ... }
❌ export interface user { ... }
❌ export type serviceResponse<T> = ...
```

---

## 📋 Examples by Category

### Services Layer

```
src/services/
├── auth.service.ts           → export const authService
├── user.service.ts           → export const userService
├── mock-auth.service.ts      → export const MockAuthService
└── index.ts                  → re-exports
```

### Utilities Layer

```
src/utils/
├── cookie-manager.ts         → export class CookieManager
├── with-error-handling.ts    → export function withErrorHandling
├── helpers.ts                → export function getErrorMessage, etc.
└── security.ts               → export function sanitizeHtml, etc.
```

### Stores Layer

```
src/stores/
├── auth-store.ts             → export const useAuthStore
├── theme-store.ts            → export const useThemeStore
└── index.ts                  → re-exports
```

### Components Layer

```
src/components/
├── ui/
│   ├── Button.tsx            → export function Button
│   └── Card.tsx              → export function Card
└── features/
    ├── auth/
    │   ├── LoginForm.tsx     → export default function LoginForm
    │   └── RegisterForm.tsx  → export default function RegisterForm
    └── user/
        └── UserProfile.tsx   → export default function UserProfile
```

### Types Layer

```
src/types/
├── api.ts                    → export interface User, type ServiceResponse
├── i18n.ts                   → export type Locale, TranslationKeys
└── index.ts                  → re-exports
```

### Constants Layer

```
src/constants/
├── config.ts                 → export const TOKEN_CONFIG, RATE_LIMITS
├── index.ts                  → re-exports
└── routes.ts                 → export const ROUTES
```

---

## 🔄 Migration from Old Conventions

### Recently Fixed

| Old Name               | New Name                 | Reason                                 |
| ---------------------- | ------------------------ | -------------------------------------- |
| `CookieManager.ts`     | `cookie-manager.ts`      | Non-component files use kebab-case     |
| `MockAuthService.ts`   | `mock-auth.service.ts`   | Service files use `.service.ts` suffix |
| `userService.ts`       | `user.service.ts`        | Consistency with `auth.service.ts`     |
| `withErrorHandling.ts` | `with-error-handling.ts` | Complete kebab-case (not mixed)        |

---

## ✅ Quick Reference

| Type             | File Name               | Export Name            | Example                                            |
| ---------------- | ----------------------- | ---------------------- | -------------------------------------------------- |
| React Component  | `PascalCase.tsx`        | `PascalCase`           | `LoginForm.tsx` → `export function LoginForm`      |
| Service Object   | `kebab-case.service.ts` | `camelCase`            | `auth.service.ts` → `export const authService`     |
| Utility Class    | `kebab-case.ts`         | `PascalCase`           | `cookie-manager.ts` → `export class CookieManager` |
| Utility Function | `kebab-case.ts`         | `camelCase`            | `helpers.ts` → `export function getErrorMessage`   |
| Store Hook       | `kebab-case-store.ts`   | `use{Name}`            | `auth-store.ts` → `export const useAuthStore`      |
| Constants        | `kebab-case.ts`         | `SCREAMING_SNAKE_CASE` | `config.ts` → `export const TOKEN_CONFIG`          |
| Types            | `kebab-case.ts`         | `PascalCase`           | `api.ts` → `export interface User`                 |
| Custom Hook      | `use-{name}.ts`         | `use{Name}`            | `use-auth.ts` → `export function useAuth`          |

---

## 🎯 Why These Conventions?

### 1. **Consistency**

- Following established TypeScript/React community patterns
- Easier for new developers to understand the codebase
- Clear file-to-export mapping

### 2. **Clarity**

- File names indicate file type (component vs utility vs service)
- Export names indicate export type (class vs function vs constant)
- Prefixes like `use` indicate custom hooks

### 3. **Tooling**

- Kebab-case works well with Unix/Linux file systems (case-sensitive)
- Works well with build tools and bundlers
- No conflicts with reserved words

### 4. **Maintainability**

- Easy to search and replace
- Clear patterns for code generation/scaffolding
- Prevents naming conflicts

---

## 📚 Additional Resources

- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

---

**Last Updated:** 2025-01-08

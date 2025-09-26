# Next.js Tailwind Starter - Developer Guide

This comprehensive guide will help you understand and effectively use this Next.js starter template. It covers everything from project structure to advanced patterns and best practices.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Project Architecture](#project-architecture)
3. [Folder Structure Deep Dive](#folder-structure-deep-dive)
4. [Error Boundary System](#error-boundary-system)
5. [Advanced Security Features](#advanced-security-features)
6. [Core Technologies](#core-technologies)
7. [Authentication System](#authentication-system)
8. [UI Components](#ui-components)
9. [State Management](#state-management)
10. [Styling & Theming](#styling--theming)
11. [Development Workflow](#development-workflow)
12. [Testing Strategy](#testing-strategy)
13. [Performance Optimization](#performance-optimization)
14. [Deployment](#deployment)
15. [Customization Guide](#customization-guide)
16. [Best Practices](#best-practices)
17. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Quick Setup

1. **Clone the repository:**

   ```bash
   git clone <your-repo-url>
   cd nextjs-tailwind-starter
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start development server:**

   ```bash
   npm run dev
   ```

4. **Open browser:**
   Navigate to `http://localhost:3000`

### Understanding the Demo

The starter includes a fully functional demo with:

- **Landing page** with hero section
- **Authentication flow** (login/register/forgot password)
- **Protected routes** (showcase, profile)
- **Component showcase** demonstrating UI components
- **Profile management** with user settings

**Demo Credentials:**

- Email: `demo@example.com`
- Password: `password`

---

## Project Architecture

This starter follows modern React patterns and Next.js best practices with enterprise-grade features:

### Architecture Principles

1. **Feature-Driven Structure** - Components organized by domain/feature
2. **Separation of Concerns** - Clear boundaries between UI, logic, and data
3. **Type Safety First** - Comprehensive TypeScript usage (89 TypeScript files)
4. **Component Composition** - Reusable, composable UI components
5. **Performance Optimized** - Code splitting, lazy loading, and optimization
6. **Security Focused** - Enterprise-grade security headers and protection
7. **Error Resilience** - Industry-standard error boundary system
8. **Production Ready** - Advanced logging, monitoring, and error reporting

### Key Architectural Decisions

- **App Router** - Uses Next.js 15+ App Router for modern routing
- **Server Components** - Leverages React 19 Server Components
- **Error Boundaries** - Strategic error boundary placement for component isolation
- **Zustand** - Lightweight state management over Redux
- **shadcn/ui** - Component library built on Radix UI primitives
- **Zod + React Hook Form** - Type-safe form validation
- **Advanced Middleware** - Route protection, security headers, and rate limiting
- **Token Management** - Industry-standard JWT handling with auto-refresh
- **Security-First** - Multi-layer security with sanitization and monitoring

---

## Folder Structure Deep Dive

### `/src/app` - Pages & Routes

```
app/
├── (auth)/              # Route group for authentication
│   ├── login/
│   │   └── page.tsx     # Login page component
│   ├── register/
│   │   └── page.tsx     # Registration page component
│   ├── forgot-password/
│   │   └── page.tsx     # Password recovery page
│   └── layout.tsx       # Auth-specific layout wrapper
├── api/                 # API routes
│   └── health/
│       └── route.ts     # Health check endpoint
├── showcase/
│   └── page.tsx         # Component showcase (protected)
├── profile/
│   └── page.tsx         # User profile page (protected)
├── privacy/
│   └── page.tsx         # Privacy policy page
├── terms/
│   └── page.tsx         # Terms of service page
├── layout.tsx           # Root layout with providers
├── page.tsx             # Landing page
└── globals.css          # Global styles with Tailwind v4
```

**Key Files:**

#### `app/layout.tsx` - Root Layout

```typescript
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background font-sans antialiased', inter.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthInitializer>
            <ConditionalNavbar />
            <main className="flex-1">{children}</main>
            <Toaster />
          </AuthInitializer>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

#### `app/page.tsx` - Landing Page

The main landing page with hero section, features, and call-to-action.

#### `(auth)/layout.tsx` - Authentication Layout

Special layout for auth pages with centered forms and different styling.

### `/src/components` - React Components

```
components/
├── ui/                  # shadcn/ui base components
├── features/            # Feature-specific components
└── providers/           # Context providers
```

#### UI Components (`/src/components/ui`)

Professional component library built with shadcn/ui:

**Core Components:**

- `button.tsx` - Button with variants (default, destructive, outline, secondary, ghost, link)
- `card.tsx` - Container components (Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter)
- `form.tsx` - Form components integrated with React Hook Form
- `input.tsx` - Input field with validation states
- `dialog.tsx` - Modal dialogs and sheets
- `dropdown-menu.tsx` - Context menus and dropdowns
- `loading.tsx` - Loading spinners and skeleton components
- `error-boundary.tsx` - Error handling wrapper

**Example Usage:**

```typescript
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Example Card</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="default" size="lg">
          Click me
        </Button>
      </CardContent>
    </Card>
  )
}
```

#### Feature Components (`/src/components/features`)

Domain-specific components organized by feature:

**Authentication (`/auth`):**

- `AuthGuard.tsx` - Route protection wrapper
- `LoginForm.tsx` - Login form with validation
- `RegisterForm.tsx` - Registration form

**Common (`/common`):**

- `Navbar.tsx` - Main navigation bar
- `ThemeToggle.tsx` - Dark/light mode switcher
- `UserDropdown.tsx` - User menu dropdown

**User Management (`/user`):**

- `UserProfile.tsx` - Profile management interface
- `UsersList.tsx` - User listing component

### `/src/hooks` - Custom Hooks

```
hooks/
├── api/                 # API-related hooks
│   ├── useApi.ts       # Generic API hook
│   └── __tests__/      # Hook tests
├── use-auth.ts         # Authentication hook
├── use-theme.ts        # Theme management
└── use-toast.ts        # Toast notifications
```

#### Example: Authentication Hook

```typescript
// hooks/use-auth.ts
export function useAuth() {
  const { user, isAuthenticated, login, logout } = useAuthStore()

  return {
    user,
    isAuthenticated,
    login: useCallback(
      async (credentials: LoginCredentials) => {
        try {
          await login(credentials)
          toast.success('Login successful!')
        } catch (error) {
          toast.error('Login failed')
          throw error
        }
      },
      [login]
    ),
    logout: useCallback(() => {
      logout()
      toast.success('Logged out successfully')
    }, [logout]),
  }
}
```

### `/src/lib` - Core Utilities

```
lib/
├── utils.ts            # General utilities & cn() helper
├── icons.tsx           # Icon components (Lucide React)
└── logger.ts           # Logging utilities
```

#### `utils.ts` - Essential Utilities

```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Utility for combining class names with Tailwind merge
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format date helper
export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}
```

### `/src/stores` - State Management

```
stores/
├── auth-store.ts       # Authentication state
└── index.ts           # Store exports
```

#### Authentication Store (Zustand)

```typescript
interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,

  login: async credentials => {
    const response = await authService.login(credentials)
    set({
      user: response.user,
      isAuthenticated: true,
    })
  },

  logout: () => {
    authService.logout()
    set({
      user: null,
      isAuthenticated: false,
    })
  },

  refreshUser: async () => {
    const user = await authService.getCurrentUser()
    set({ user })
  },
}))
```

### `/src/types` - Type Definitions

```
types/
├── api/                # API-related types
│   ├── auth.ts        # Authentication types
│   ├── users.ts       # User types
│   └── common.ts      # Common API types
├── entities/          # Domain entities
│   └── user.ts        # User entity
├── ui/               # UI-related types
│   └── theme.ts      # Theme types
└── common/           # Utility types
```

### `/src/utils` - Helper Functions

```
utils/
├── api/              # API utilities
│   ├── client.ts     # HTTP client configuration
│   └── helpers.ts    # API helper functions
├── auth/             # Authentication utilities
│   └── tokenManager.ts # Token management
├── security.ts       # Security utilities
└── validation.ts     # Validation helpers
```

### `/src/services` - External Services

```
services/
├── authService.ts    # Authentication API service
├── userService.ts    # User management service
└── index.ts         # Service exports
```

### `middleware.ts` - Route Protection & Security

```typescript
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protected routes
  const protectedRoutes = ['/showcase', '/profile']
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  )

  // Check authentication
  const token = request.cookies.get('auth_token')?.value

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Security headers
  const response = NextResponse.next()

  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-XSS-Protection', '1; mode=block')

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

---

## Error Boundary System

### Industry-Standard Implementation

Your project includes a comprehensive error boundary system that follows industry best practices used by companies like Netflix, Airbnb, and Facebook.

#### Core Components

**1. Enhanced ErrorBoundary (`src/components/ui/error-boundary.tsx`)**

```typescript
// Full-featured error boundary with retry logic
<ErrorBoundary
  componentName="UserProfile"
  resetOnPropsChange={true}
>
  <UserProfile />
</ErrorBoundary>
```

**Features:**

- **Automatic Retry** - Up to 3 retry attempts with exponential backoff
- **Error Reporting** - Integrated with error tracking services (Sentry-ready)
- **Development vs Production** - Different UI for debugging vs user experience
- **Error Context Collection** - Rich error context with user, session, component info
- **Unique Error IDs** - For tracking and support ticket correlation

**2. SectionErrorBoundary - Component Isolation**

```typescript
// For isolating specific sections
<SectionErrorBoundary
  componentName="LoginForm"
  title="Login Error"
  description="The login form encountered an error. Please refresh and try again."
>
  <LoginForm />
</SectionErrorBoundary>
```

**3. AsyncErrorBoundary - Promise Error Handling**

```typescript
// For handling async errors in components
<AsyncErrorBoundary componentName="DataFetcher">
  <DataComponent />
</AsyncErrorBoundary>
```

**4. withErrorBoundary HOC - Decorator Pattern**

```typescript
// For wrapping existing components
const SafeUserList = withErrorBoundary(UserList, {
  componentName: 'UserList',
  isolate: true,
  resetOnPropsChange: true,
})
```

#### Strategic Placement

**✅ Where Error Boundaries are Currently Implemented:**

- **LoginForm** - Protects authentication flow
- **RegisterForm** - Protects registration process
- **UserProfile** - Protects user data display
- **LocaleSwitcher** - Protects internationalization features

**🎯 Recommended for New Features:**

- Page-level boundaries for major routes
- Data-heavy components (lists, tables, charts)
- Third-party integrations
- Payment/checkout flows
- File upload components

#### Error Recovery Strategies

**1. Automatic Retry (Built-in)**

```typescript
// Configurable retry attempts with backoff
const maxRetries = 3
const retryDelay = 1000 // milliseconds
```

**2. Props-Based Reset**

```typescript
// Resets when props change
<ErrorBoundary resetOnPropsChange={true}>
  <ComponentThatDependsOnProps />
</ErrorBoundary>
```

**3. Manual Recovery**

- Users can click "Try Again" button
- "Reload Page" for critical errors
- Error reporting for support

#### Error Reporting Integration

**Local Development:**

- Full stack traces and component trees
- Error details toggle for debugging
- Console logging with rich context

**Production:**

- User-friendly error messages
- Error ID for support tickets
- Automatic error reporting to external services
- Performance impact logging

---

## Advanced Security Features

### Multi-Layer Security Architecture

Your project implements enterprise-grade security following OWASP recommendations.

#### 1. Comprehensive Middleware Security

**Security Headers (`src/middleware.ts`):**

```typescript
// OWASP-recommended security headers
response.headers.set('X-Frame-Options', 'DENY')
response.headers.set('X-Content-Type-Options', 'nosniff')
response.headers.set('X-XSS-Protection', '1; mode=block')
response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

// Content Security Policy
response.headers.set(
  'Content-Security-Policy',
  "default-src 'self'; script-src 'self' 'nonce-xyz'; ..."
)

// HSTS in production
response.headers.set(
  'Strict-Transport-Security',
  'max-age=31536000; includeSubDomains; preload'
)
```

**Rate Limiting:**

- **API Routes**: 100 requests per 15 minutes
- **General Routes**: 300 requests per 15 minutes
- **Memory Store**: In-memory rate limiting with cleanup
- **IP + User-Agent**: Identification for better accuracy

#### 2. Input Sanitization (`src/utils/security.ts`)

**Multi-Level HTML Sanitization:**

```typescript
// Strict mode - basic text only
sanitizeHtml(userInput, 'strict')

// Basic mode - common safe HTML
sanitizeHtml(userInput, 'basic')

// Rich mode - full HTML with safe elements
sanitizeHtml(userInput, 'rich')
```

**Features:**

- **DOMPurify Integration** - Industry-standard XSS prevention
- **Configurable Policies** - Different levels for different use cases
- **Automatic Logging** - Security events tracked and logged
- **React Integration** - `sanitizeForReact()` for dangerouslySetInnerHTML

#### 3. Advanced Token Management

**Industry-Standard JWT Handling (`src/utils/auth/tokenManager.ts`):**

```typescript
class SecureTokenManager {
  // Secure token storage
  storeTokens(tokens: TokenPair): void

  // Auto-refresh with rotation
  async refreshAccessToken(): Promise<TokenPair>

  // Validation and expiry checking
  validateAccessToken(): TokenValidation

  // Secure cleanup
  clearTokens(): void
}
```

**Security Features:**

- **Token Rotation** - New refresh token on each refresh
- **Auto-Refresh** - Transparent token refresh before expiry
- **Secure Storage** - HttpOnly cookies for refresh tokens
- **Concurrent Protection** - Prevents multiple refresh attempts
- **Expiry Validation** - Smart token validation and renewal

#### 4. Security Monitoring

**Suspicious Activity Detection:**

```typescript
// Middleware checks for:
- Bot/crawler patterns in User-Agent
- Missing or suspicious User-Agent strings
- Unusual request patterns
- Resource loading failures
```

**Security Event Logging:**

- All security events logged with context
- Rate limit violations tracked
- Suspicious requests blocked and logged
- Error tracking with security context

#### 5. File Upload Security (Available)

```typescript
// Secure file validation
validateFileUpload(file, allowedTypes, maxSize)

// Features:
- MIME type validation
- File size limits
- Extension checking
- Security event logging
```

#### 6. URL Validation

```typescript
// Prevent open redirect attacks
validateRedirectUrl(url, allowedDomains)

// Blocks:
- javascript: protocol
- data: protocol
- Unauthorized domains
- Malformed URLs
```

---

## Core Technologies

### Next.js 15 with App Router

This starter uses the latest Next.js features:

- **App Router** - File-based routing with layouts
- **Server Components** - React 19 Server Components by default
- **Route Groups** - `(auth)` for grouping related routes
- **Middleware** - Route protection and security
- **API Routes** - Backend API in `/app/api`

### React 19

Leverages the latest React features:

- **Server Components** - Default for better performance
- **Streaming** - Progressive page rendering
- **Suspense** - Better loading states
- **Concurrent Features** - Non-blocking rendering

### TypeScript

Strict type safety throughout:

```typescript
// Strict tsconfig.json configuration
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### Tailwind CSS v4

Modern utility-first styling:

```css
/* globals.css - CSS-first configuration */
@import 'tailwindcss';

@theme {
  --color-primary: hsl(221.2 83.2% 53.3%);
  --color-secondary: hsl(210 40% 98%);
  /* Design system tokens */
}
```

---

## Authentication System

### How It Works

1. **Demo Authentication** - Simulated login with demo credentials
2. **Token-Based** - Uses HTTP-only cookies for security
3. **Route Protection** - Middleware-based protection
4. **State Management** - Zustand for auth state
5. **Form Validation** - Zod schemas with React Hook Form

### Authentication Flow

```typescript
// Login process
1. User submits credentials → LoginForm
2. Form validation → Zod schema
3. API call → authService.login()
4. Token storage → HTTP-only cookie
5. State update → useAuthStore
6. Route redirect → protected page
```

### Implementing Real Authentication

Replace the demo service with real API:

```typescript
// services/authService.ts
class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Replace with your API endpoint
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      throw new Error('Login failed')
    }

    const data = await response.json()

    // Store token securely
    document.cookie = `auth_token=${data.token}; HttpOnly; Secure; SameSite=Strict`

    return data
  }

  async getCurrentUser(): Promise<User> {
    const response = await fetch('/api/auth/me', {
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error('Failed to get user')
    }

    return response.json()
  }
}
```

### Protecting Routes

Add routes to middleware:

```typescript
// middleware.ts
const protectedRoutes = ['/dashboard', '/settings', '/admin']
```

---

## UI Components

### shadcn/ui Integration

This starter uses shadcn/ui for professional components:

#### Component Structure

```typescript
// Typical component structure
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
```

#### Adding New Components

1. **Install shadcn/ui component:**

   ```bash
   npx shadcn@latest add [component-name]
   ```

   Available components include: `button`, `card`, `dialog`, `input`, `badge`, `alert`, `toast`, `dropdown-menu`, `navigation-menu`, `tabs`, `form`, `select`, `checkbox`, `textarea`, `separator`, `skeleton`, and many more.

2. **Example - Adding a Badge component:**

   ```bash
   npx shadcn@latest add badge
   ```

   This will:
   - Create `/src/components/ui/badge.tsx` with lowercase filename (following industry standard)
   - Automatically add the export to `/src/components/ui/index.ts`
   - Install any required dependencies

3. **Import and use:**

   ```typescript
   import { Badge } from '@/components/ui/badge'

   <Badge variant="secondary">New</Badge>
   <Badge variant="destructive">Error</Badge>
   <Badge variant="outline">Draft</Badge>
   ```

4. **View all available components:**

   ```bash
   npx shadcn@latest add --help
   ```

   Or browse the official registry at [ui.shadcn.com/docs/components](https://ui.shadcn.com/docs/components)

**Important Notes:**

- All component files use **lowercase with kebab-case** naming (e.g., `badge.tsx`, `dropdown-menu.tsx`)
- Components are automatically added to the barrel export in `index.ts`
- Each component comes with TypeScript definitions and Tailwind styling
- Components are built on Radix UI primitives for accessibility

### Custom Components

Create feature-specific components in `/components/features`:

```typescript
// components/features/common/FeatureCard.tsx
interface FeatureCardProps {
  title: string
  description: string
  icon: React.ReactNode
  href: string
}

export function FeatureCard({ title, description, icon, href }: FeatureCardProps) {
  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
          {icon}
        </div>
        <CardTitle className="group-hover:text-primary transition-colors">
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild variant="outline" className="w-full">
          <Link href={href}>
            Learn more
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
```

---

## State Management

### Zustand Philosophy

Zustand provides:

- **Simple API** - Easy to learn and use
- **Small Bundle** - ~1KB minified
- **TypeScript First** - Excellent TS support
- **No Providers** - Use directly in components
- **DevTools** - Redux DevTools integration

### Creating Stores

```typescript
// stores/theme-store.ts
interface ThemeState {
  theme: 'light' | 'dark' | 'system'
  setTheme: (theme: 'light' | 'dark' | 'system') => void
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'system',
  setTheme: (theme) => set({ theme })
}))

// Usage in components
function ThemeToggle() {
  const { theme, setTheme } = useThemeStore()

  return (
    <Button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Toggle theme
    </Button>
  )
}
```

### Persistent State

For data that should persist:

```typescript
import { persist } from 'zustand/middleware'

export const useSettingsStore = create<SettingsState>()(
  persist(
    set => ({
      language: 'en',
      notifications: true,
      setLanguage: language => set({ language }),
      toggleNotifications: () =>
        set(state => ({
          notifications: !state.notifications,
        })),
    }),
    {
      name: 'user-settings',
    }
  )
)
```

---

## Styling & Theming

### Tailwind CSS v4

The starter uses Tailwind v4 with CSS-first configuration:

```css
/* app/globals.css */
@import 'tailwindcss';

@theme {
  /* Colors */
  --color-primary: hsl(221.2 83.2% 53.3%);
  --color-primary-foreground: hsl(210 40% 98%);
  --color-secondary: hsl(210 40% 96%);
  --color-secondary-foreground: hsl(222.2 84% 4.9%);

  /* Spacing */
  --spacing-section: 5rem;
  --spacing-container: 1rem;

  /* Typography */
  --font-family-sans: 'Inter Variable', sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
}
```

### Dark Mode

Automatic theme switching with system preference:

```typescript
// components/providers/theme-provider.tsx
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  )
}
```

### Custom Styling Patterns

#### Component Variants with CVA

```typescript
import { cva, type VariantProps } from 'class-variance-authority'

const cardVariants = cva(
  'rounded-lg border bg-card text-card-foreground shadow-sm',
  {
    variants: {
      variant: {
        default: 'border-border',
        destructive: 'border-red-500 bg-red-50 text-red-900',
        success: 'border-green-500 bg-green-50 text-green-900',
      },
      size: {
        sm: 'p-3',
        md: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)
```

#### Responsive Design

```typescript
// Mobile-first responsive patterns
<div className="
  grid
  grid-cols-1
  md:grid-cols-2
  lg:grid-cols-3
  gap-4
  md:gap-6
  lg:gap-8
">
  {/* Content */}
</div>
```

---

## Development Workflow

### Code Quality Tools

#### ESLint Configuration

```javascript
// eslint.config.mjs
export default [
  {
    extends: ['next/core-web-vitals', 'next/typescript'],
    rules: {
      'prefer-const': 'error',
      'no-unused-vars': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
]
```

#### Prettier Setup

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "arrowParens": "avoid"
}
```

#### Pre-commit Hooks

```json
// package.json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,css,md}": ["prettier --write"]
  }
}
```

### Development Scripts

```bash
# Development
npm run dev              # Start with Turbopack
npm run dev:webpack      # Start with Webpack

# Building
npm run build           # Production build
npm run start           # Start production server

# Code Quality
npm run lint            # Fix linting issues
npm run lint:check      # Check without fixing
npm run format          # Format code
npm run typecheck       # Type checking

# Testing
npm run test            # Run tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report

# Analysis
npm run analyze         # Bundle analysis
npm run clean           # Clean build files
```

### Environment Configuration

```bash
# .env.local
NODE_ENV=development
AUTH_TOKEN_KEY=auth_token

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api
API_SECRET_KEY=your-secret-key

# Database (if using)
DATABASE_URL=postgresql://user:pass@localhost:5432/db

# External Services
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

---

## Testing Strategy

### Backend/Business Logic Focus (High ROI Approach)

This project follows a **pragmatic testing strategy** focusing on high-value, stable business logic rather than UI components.

#### Why This Approach?

**✅ Test Backend/Business Logic:**

- **High ROI** - Critical functionality that affects users
- **Stable** - Business logic changes less frequently than UI
- **Easy to Test** - Pure functions, predictable inputs/outputs
- **Critical Impact** - Bugs here affect core functionality

**❌ Skip UI Testing (For Now):**

- **High Maintenance** - UI tests break with design changes
- **Low ROI** - Most UI bugs are visual, caught in manual testing
- **Complex Setup** - Requires extensive mocking and fixtures

#### Priority Testing Areas

**1. Authentication Services (90% Coverage Goal)**

```bash
# Test files to create:
src/services/__tests__/authService.test.ts
src/utils/auth/__tests__/tokenManager.test.ts
```

```typescript
// Example: Authentication service testing
describe('authService', () => {
  describe('login', () => {
    it('should login with valid credentials', async () => {
      const result = await authService.login({
        email: 'demo@example.com',
        password: 'password',
      })

      expect(result.success).toBe(true)
      expect(result.data.user.email).toBe('demo@example.com')
    })

    it('should reject invalid credentials', async () => {
      await expect(
        authService.login({
          email: 'invalid@example.com',
          password: 'wrong',
        })
      ).rejects.toThrow('Invalid credentials')
    })
  })
})
```

**2. Token Management (85% Coverage Goal)**

```typescript
// Example: Token manager testing
describe('TokenManager', () => {
  it('should store and retrieve tokens', () => {
    const tokens = generateMockTokens()
    tokenManager.storeTokens(tokens)

    expect(tokenManager.getCurrentAccessToken()).toBe(tokens.accessToken)
  })

  it('should auto-refresh expired tokens', async () => {
    const expiredTokens = generateExpiredTokens()
    tokenManager.storeTokens(expiredTokens)

    const validToken = await tokenManager.getValidAccessToken()
    expect(validToken).toBeTruthy()
    expect(validToken).not.toBe(expiredTokens.accessToken)
  })
})
```

**3. Security Utilities (85% Coverage Goal)**

```typescript
// Example: Security function testing
describe('Security Utils', () => {
  describe('sanitizeHtml', () => {
    it('should remove script tags', () => {
      const malicious = '<script>alert("xss")</script><p>Safe content</p>'
      const clean = sanitizeHtml(malicious, 'basic')

      expect(clean).not.toContain('<script>')
      expect(clean).toContain('<p>Safe content</p>')
    })
  })

  describe('rateLimiter', () => {
    it('should allow requests under limit', () => {
      expect(rateLimiter.isRateLimited('test-ip', 10)).toBe(false)
    })

    it('should block requests over limit', () => {
      // Simulate 11 requests
      for (let i = 0; i < 11; i++) {
        rateLimiter.isRateLimited('test-ip-2', 10)
      }
      expect(rateLimiter.isRateLimited('test-ip-2', 10)).toBe(true)
    })
  })
})
```

**4. API Helpers (80% Coverage Goal)**

```typescript
// Example: API client testing
describe('API Client', () => {
  it('should handle successful requests', async () => {
    const mockResponse = { data: { id: 1, name: 'Test' } }
    // Mock fetch response

    const result = await api.get('/test')
    expect(result).toEqual(mockResponse)
  })

  it('should retry on 401 with token refresh', async () => {
    // Mock 401 then success
    const result = await api.get('/protected')
    expect(result).toBeTruthy()
  })
})
```

**5. Environment Configuration (70% Coverage Goal)**

```typescript
// Example: Config validation testing
describe('Environment Config', () => {
  it('should validate required environment variables', () => {
    process.env.NODE_ENV = 'test'
    expect(() => validateEnv()).not.toThrow()
  })

  it('should throw on invalid NODE_ENV', () => {
    process.env.NODE_ENV = 'invalid'
    expect(() => validateEnv()).toThrow()
  })
})
```

#### Testing Setup (Vitest Recommended)

```bash
# Install testing dependencies
npm install -D vitest @testing-library/jest-dom jsdom
```

```javascript
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
```

### Test Examples

#### Component Testing

```typescript
// __tests__/components/Button.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })

  it('handles click events', async () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    await userEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies variant styles', () => {
    render(<Button variant="destructive">Delete</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-destructive')
  })
})
```

#### Hook Testing

```typescript
// hooks/__tests__/useAuth.test.tsx
import { renderHook, act } from '@testing-library/react'
import { useAuth } from '@/hooks/use-auth'

describe('useAuth', () => {
  it('should login successfully', async () => {
    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.login({
        email: 'test@example.com',
        password: 'password',
      })
    })

    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user).toBeTruthy()
  })
})
```

### Testing Best Practices

1. **Test User Behavior** - Focus on what users do, not implementation
2. **Use Testing Library** - Query by role, label, text
3. **Mock External Dependencies** - APIs, services, third-party libraries
4. **Test Error States** - Loading, error, and edge cases
5. **Integration Tests** - Test feature flows end-to-end

---

## Deployment

### Vercel (Recommended)

1. **Connect Repository:**
   - Import project from GitHub/GitLab
   - Vercel auto-detects Next.js configuration

2. **Environment Variables:**

   ```bash
   # Production environment
   NODE_ENV=production
   AUTH_TOKEN_KEY=your-production-secret
   NEXT_PUBLIC_API_URL=https://your-api.com
   ```

3. **Build Configuration:**
   ```javascript
   // next.config.ts
   export default {
     output: 'standalone', // For Docker deployment
     experimental: {
       turbo: {
         rules: {
           '*.svg': {
             loaders: ['@svgr/webpack'],
             as: '*.js',
           },
         },
       },
     },
   }
   ```

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
```

## Performance Optimization

### Current Optimizations (Built-in)

Your project already includes several performance optimizations:

#### 1. Next.js 15 + Turbopack

```typescript
// next.config.ts - Already configured
experimental: {
  optimizePackageImports: [
    '@/components',
    '@/utils',
    '@/hooks',
    'lucide-react',
    'zustand',
  ],
},
```

#### 2. Advanced Bundle Configuration

```typescript
// Automatic tree shaking
config.optimization = {
  ...config.optimization,
  sideEffects: false,
}

// Bundle analysis built-in
npm run analyze        # Full bundle analysis
npm run analyze:server # Server bundle
npm run analyze:browser # Browser bundle
```

#### 3. Image Optimization

```typescript
// next.config.ts - Production-ready settings
images: {
  formats: ['image/webp', 'image/avif'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
},
```

### Advanced Performance Patterns

#### 1. React Performance Optimization

**Add React.memo to Expensive Components:**

```typescript
// For components that render frequently
const ExpensiveUserCard = React.memo(({ user, onAction }) => {
  // Component logic
})

// For lists with many items
const UserListItem = React.memo(({ user }) => {
  // Memoize expensive calculations
  const userStats = useMemo(() =>
    calculateUserStats(user), [user]
  )

  return <div>{/* Component JSX */}</div>
})
```

**Smart Memoization:**

```typescript
// Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return heavyCalculation(data)
}, [data])

// Memoize callback functions
const handleUserAction = useCallback(
  (userId: string) => {
    // Action logic
  },
  [dependencies]
)
```

#### 2. Code Splitting & Lazy Loading

**Component-Level Code Splitting:**

```typescript
// Dynamic imports for heavy components
const DataVisualization = lazy(() =>
  import('@/components/features/analytics/DataVisualization')
)

// Route-based code splitting
const AdminPanel = lazy(() => import('@/app/admin/AdminPanel'))

// Usage with Suspense
function Dashboard() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DataVisualization />
    </Suspense>
  )
}
```

**Library Code Splitting:**

```typescript
// Split heavy libraries
const ChartComponent = lazy(() =>
  import('recharts').then(module => ({
    default: module.LineChart,
  }))
)
```

#### 3. Data Loading Optimization

**Smart Data Fetching:**

```typescript
// Use SWR or React Query for caching
import useSWR from 'swr'

function UserProfile({ userId }: { userId: string }) {
  const { data, error, isLoading } = useSWR(
    `/api/users/${userId}`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute
    }
  )

  if (isLoading) return <ProfileSkeleton />
  if (error) return <ErrorFallback />
  return <ProfileContent data={data} />
}
```

**API Response Optimization:**

```typescript
// src/utils/api/client.ts - Already includes:
// - Request deduplication
// - Automatic retry with exponential backoff
// - Token auto-refresh
// - Error boundary integration
```

#### 4. State Management Performance

**Zustand Optimization:**

```typescript
// Selective subscription to prevent unnecessary re-renders
function UserComponent() {
  // Only subscribe to specific fields
  const userName = useAuthStore(state => state.user?.name)

  // Use shallow comparison for objects
  const userProfile = useAuthStore(
    state => ({ user: state.user, isLoading: state.isLoading }),
    shallow
  )
}
```

### Performance Monitoring

#### 1. Built-in Performance Tracking

Your project includes performance monitoring:

```typescript
// src/lib/logger.ts - Already implemented
logger.performance('component_render', renderTime, {
  component: 'UserList',
  itemCount: users.length,
})

// Error reporting with performance context
errorReporting.reportPerformanceIssue(
  'slow_api_response',
  responseTime,
  2000 // threshold
)
```

#### 2. Core Web Vitals Monitoring

```typescript
// Add to your pages for monitoring
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

function sendToAnalytics(metric) {
  // Send to your analytics service
  logger.performance(metric.name, metric.value)
}

// Track all Core Web Vitals
getCLS(sendToAnalytics)
getFID(sendToAnalytics)
getFCP(sendToAnalytics)
getLCP(sendToAnalytics)
getTTFB(sendToAnalytics)
```

### Optimization Checklist

#### ⚡ Immediate Optimizations (This Week)

**1. Add React.memo to Heavy Components:**

```typescript
// Target these components:
- UsersList component (if it exists)
- Data visualization components
- Form components with complex validation
```

**2. Implement Dynamic Imports:**

```typescript
// For non-critical components:
const AdminPanel = lazy(() => import('./AdminPanel'))
const Analytics = lazy(() => import('./Analytics'))
```

**3. Optimize Images:**

```typescript
// Replace img tags with Next.js Image
import Image from 'next/image'

<Image
  src="/hero-image.jpg"
  alt="Hero image"
  width={800}
  height={600}
  priority // For above-the-fold images
  placeholder="blur" // For better UX
  blurDataURL="data:image/jpeg;base64,..."
/>
```

#### 📊 Performance Budget

**Target Metrics:**

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms
- **Bundle Size**: < 250KB initial load

**Monitor With:**

```bash
# Bundle analysis
npm run analyze

# Lighthouse audit
npx lighthouse http://localhost:3000 --view

# Core Web Vitals
# Use built-in Next.js analytics or web-vitals package
```

#### 🔧 Advanced Optimizations (Future)

**1. Service Worker for Caching:**

```typescript
// Implement service worker for offline support
// Cache static assets and API responses
```

**2. Virtual Scrolling for Large Lists:**

```typescript
// For lists with 100+ items
import { FixedSizeList as List } from 'react-window'
```

**3. Database Query Optimization:**

```typescript
// When integrating with real backend:
// - Implement pagination
// - Use database indexes
// - Optimize N+1 queries
```

### Performance Testing

```bash
# Performance testing commands
npm run build              # Test build performance
npm run analyze           # Bundle size analysis
npm run lighthouse        # Performance audit (add to package.json)

# Load testing
npm install -g clinic
clinic doctor -- node server.js
```

---

## Customization Guide

### Adding New Pages

1. **Create page file:**

   ```typescript
   // app/dashboard/page.tsx
   export default function DashboardPage() {
     return (
       <div className="container mx-auto py-8">
         <h1 className="text-3xl font-bold">Dashboard</h1>
       </div>
     )
   }
   ```

2. **Add to navigation:**

   ```typescript
   // components/features/common/Navbar.tsx
   const navigation = [
     { name: 'Home', href: '/' },
     { name: 'Dashboard', href: '/dashboard' },
     { name: 'Profile', href: '/profile' },
   ]
   ```

3. **Protect route (if needed):**
   ```typescript
   // middleware.ts
   const protectedRoutes = ['/dashboard', '/profile']
   ```

### Creating New Components

1. **UI Component (reusable):**

   ```typescript
   // components/ui/tooltip.tsx
   export function Tooltip({ children, content }: TooltipProps) {
     return (
       <TooltipProvider>
         <TooltipRoot>
           <TooltipTrigger asChild>{children}</TooltipTrigger>
           <TooltipContent>{content}</TooltipContent>
         </TooltipRoot>
       </TooltipProvider>
     )
   }
   ```

2. **Feature Component (specific):**
   ```typescript
   // components/features/analytics/AnalyticsCard.tsx
   export function AnalyticsCard({ title, value, trend }: AnalyticsCardProps) {
     return (
       <Card>
         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
           <CardTitle className="text-sm font-medium">{title}</CardTitle>
           <TrendingUp className="h-4 w-4 text-muted-foreground" />
         </CardHeader>
         <CardContent>
           <div className="text-2xl font-bold">{value}</div>
           <p className="text-xs text-muted-foreground">{trend}</p>
         </CardContent>
       </Card>
     )
   }
   ```

### Extending Authentication

1. **Add new auth provider:**

   ```typescript
   // services/authService.ts
   class AuthService {
     async loginWithGoogle(): Promise<AuthResponse> {
       // Google OAuth implementation
     }

     async loginWithGitHub(): Promise<AuthResponse> {
       // GitHub OAuth implementation
     }
   }
   ```

2. **Update auth store:**
   ```typescript
   // stores/auth-store.ts
   interface AuthState {
     // ... existing state
     loginWithProvider: (provider: 'google' | 'github') => Promise<void>
   }
   ```

### Adding API Routes

1. **Create API route:**

   ```typescript
   // app/api/users/route.ts
   export async function GET() {
     const users = await getUsersFromDatabase()
     return Response.json(users)
   }

   export async function POST(request: Request) {
     const body = await request.json()
     const user = await createUser(body)
     return Response.json(user, { status: 201 })
   }
   ```

2. **Create service:**
   ```typescript
   // services/userService.ts
   class UserService {
     async getUsers(): Promise<User[]> {
       const response = await fetch('/api/users')
       return response.json()
     }
   }
   ```

---

## Best Practices

### Component Design

1. **Single Responsibility** - Each component should have one clear purpose
2. **Composition over Inheritance** - Build complex UIs by combining simple components
3. **Props Interface** - Always define TypeScript interfaces for props
4. **Default Props** - Provide sensible defaults
5. **Error Boundaries** - Handle errors gracefully

### State Management

1. **Local State First** - Use useState for component-specific state
2. **Lift State Up** - Share state at the lowest common ancestor
3. **Global State Sparingly** - Only for truly global data
4. **Immutable Updates** - Never mutate state directly
5. **Derived State** - Compute values from state rather than storing them

### Performance

1. **React.memo** - Memoize components that render frequently
2. **useMemo/useCallback** - Memoize expensive calculations and functions
3. **Code Splitting** - Lazy load heavy components
4. **Image Optimization** - Use Next.js Image component
5. **Bundle Analysis** - Regular bundle size monitoring

### Security

1. **Input Validation** - Validate all user inputs with Zod
2. **XSS Prevention** - Sanitize HTML content
3. **Environment Variables** - Keep secrets in environment variables
4. **HTTPS Only** - Always use HTTPS in production
5. **Security Headers** - Set appropriate security headers

### Accessibility

1. **Semantic HTML** - Use proper HTML elements
2. **ARIA Labels** - Add labels for screen readers
3. **Keyboard Navigation** - Ensure keyboard accessibility
4. **Color Contrast** - Meet WCAG contrast requirements
5. **Focus Management** - Manage focus states properly

---

## Troubleshooting

### Common Issues

#### Build Errors

**TypeScript Errors:**

```bash
# Fix type issues
npm run typecheck

# Common fixes
- Add missing type definitions
- Check import/export statements
- Verify interface implementations
```

**ESLint Errors:**

```bash
# Fix linting issues
npm run lint

# Common fixes
- Remove unused variables
- Fix import order
- Add missing dependencies to useEffect
```

#### Runtime Issues

**Authentication Problems:**

- Check middleware configuration
- Verify token storage
- Check API endpoints
- Validate credentials format

**Styling Issues:**

- Clear Tailwind cache: `rm -rf .next`
- Check class name conflicts
- Verify CSS import order
- Check responsive breakpoints

#### Development Issues

**Slow Performance:**

- Use `npm run dev` (Turbopack) instead of `npm run dev:webpack`
- Check bundle size with `npm run analyze`
- Remove unnecessary dependencies
- Optimize images and assets

**Hot Reload Not Working:**

- Restart development server
- Check file system watchers
- Verify file permissions
- Clear browser cache

### Debug Tools

1. **React DevTools** - Component tree inspection
2. **Redux DevTools** - State debugging (works with Zustand)
3. **Network Tab** - API request debugging
4. **Lighthouse** - Performance auditing
5. **Bundle Analyzer** - Bundle size analysis

### Getting Help

- **Documentation** - Check Next.js, React, Tailwind docs
- **GitHub Issues** - Search existing issues
- **Stack Overflow** - Community help
- **Discord/Forums** - Real-time help

---

## Summary

This Next.js Tailwind Starter provides a solid foundation for modern web applications with:

- **Latest Technologies** - Next.js 15, React 19, TypeScript, Tailwind v4
- **Professional UI** - shadcn/ui component library
- **Authentication System** - Complete auth flow with protection
- **Performance Optimized** - Turbopack, code splitting, optimizations
- **Developer Experience** - TypeScript, ESLint, Prettier, testing
- **Production Ready** - Security headers, error handling, deployment

The modular architecture makes it easy to extend and customize for your specific needs. Start building your next project with this comprehensive foundation!

---

**Happy coding! 🚀**

For questions or contributions, please check the [README.md](./README.md) or open an issue on GitHub.

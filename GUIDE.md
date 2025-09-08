# Next.js Tailwind Starter - Developer Guide

This comprehensive guide will help you understand and effectively use this Next.js starter template. It covers everything from project structure to advanced patterns and best practices.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Project Architecture](#project-architecture)
3. [Folder Structure Deep Dive](#folder-structure-deep-dive)
4. [Core Technologies](#core-technologies)
5. [Authentication System](#authentication-system)
6. [UI Components](#ui-components)
7. [State Management](#state-management)
8. [Styling & Theming](#styling--theming)
9. [Development Workflow](#development-workflow)
10. [Testing Strategy](#testing-strategy)
11. [Deployment](#deployment)
12. [Customization Guide](#customization-guide)
13. [Best Practices](#best-practices)
14. [Troubleshooting](#troubleshooting)

---

## Getting Started

/clear

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

This starter follows modern React patterns and Next.js best practices:

### Architecture Principles

1. **Feature-Driven Structure** - Components organized by domain/feature
2. **Separation of Concerns** - Clear boundaries between UI, logic, and data
3. **Type Safety First** - Comprehensive TypeScript usage
4. **Component Composition** - Reusable, composable UI components
5. **Performance Optimized** - Code splitting, lazy loading, and optimization
6. **Security Focused** - Built-in security headers and protection

### Key Architectural Decisions

- **App Router** - Uses Next.js 13+ App Router for modern routing
- **Server Components** - Leverages React 19 Server Components
- **Zustand** - Lightweight state management over Redux
- **shadcn/ui** - Component library built on Radix UI primitives
- **Zod + React Hook Form** - Type-safe form validation
- **Middleware** - Route protection and security headers

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
  const { user, isAuthenticated, login, logout } = useAuthStore();

  return {
    user,
    isAuthenticated,
    login: useCallback(
      async (credentials: LoginCredentials) => {
        try {
          await login(credentials);
          toast.success("Login successful!");
        } catch (error) {
          toast.error("Login failed");
          throw error;
        }
      },
      [login],
    ),
    logout: useCallback(() => {
      logout();
      toast.success("Logged out successfully");
    }, [logout]),
  };
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
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility for combining class names with Tailwind merge
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date helper
export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
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
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,

  login: async (credentials) => {
    const response = await authService.login(credentials);
    set({
      user: response.user,
      isAuthenticated: true,
    });
  },

  logout: () => {
    authService.logout();
    set({
      user: null,
      isAuthenticated: false,
    });
  },

  refreshUser: async () => {
    const user = await authService.getCurrentUser();
    set({ user });
  },
}));
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
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected routes
  const protectedRoutes = ["/showcase", "/profile"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // Check authentication
  const token = request.cookies.get("auth_token")?.value;

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Security headers
  const response = NextResponse.next();

  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-XSS-Protection", "1; mode=block");

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
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
@import "tailwindcss";

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
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();

    // Store token securely
    document.cookie = `auth_token=${data.token}; HttpOnly; Secure; SameSite=Strict`;

    return data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await fetch("/api/auth/me", {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to get user");
    }

    return response.json();
  }
}
```

### Protecting Routes

Add routes to middleware:

```typescript
// middleware.ts
const protectedRoutes = ["/dashboard", "/settings", "/admin"];
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
import { persist } from "zustand/middleware";

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: "en",
      notifications: true,
      setLanguage: (language) => set({ language }),
      toggleNotifications: () =>
        set((state) => ({
          notifications: !state.notifications,
        })),
    }),
    {
      name: "user-settings",
    },
  ),
);
```

---

## Styling & Theming

### Tailwind CSS v4

The starter uses Tailwind v4 with CSS-first configuration:

```css
/* app/globals.css */
@import "tailwindcss";

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
  --font-family-sans: "Inter Variable", sans-serif;
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
import { cva, type VariantProps } from "class-variance-authority";

const cardVariants = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm",
  {
    variants: {
      variant: {
        default: "border-border",
        destructive: "border-red-500 bg-red-50 text-red-900",
        success: "border-green-500 bg-green-50 text-green-900",
      },
      size: {
        sm: "p-3",
        md: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);
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
    extends: ["next/core-web-vitals", "next/typescript"],
    rules: {
      "prefer-const": "error",
      "no-unused-vars": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];
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

### Jest Configuration

```javascript
// jest.config.js
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/src/test/setup.ts"],
  testEnvironment: "jsdom",
  moduleNameMapping: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

module.exports = createJestConfig(customJestConfig);
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
import { renderHook, act } from "@testing-library/react";
import { useAuth } from "@/hooks/use-auth";

describe("useAuth", () => {
  it("should login successfully", async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login({
        email: "test@example.com",
        password: "password",
      });
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toBeTruthy();
  });
});
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
     output: "standalone", // For Docker deployment
     experimental: {
       turbo: {
         rules: {
           "*.svg": {
             loaders: ["@svgr/webpack"],
             as: "*.js",
           },
         },
       },
     },
   };
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

### Performance Optimization

```typescript
// Lazy loading components
const HeavyComponent = lazy(() => import('@/components/HeavyComponent'))

// Image optimization
import Image from 'next/image'

<Image
  src="/hero-image.jpg"
  alt="Hero"
  width={800}
  height={600}
  priority
/>

// Bundle analysis
npm run analyze
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
     { name: "Home", href: "/" },
     { name: "Dashboard", href: "/dashboard" },
     { name: "Profile", href: "/profile" },
   ];
   ```

3. **Protect route (if needed):**
   ```typescript
   // middleware.ts
   const protectedRoutes = ["/dashboard", "/profile"];
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
     loginWithProvider: (provider: "google" | "github") => Promise<void>;
   }
   ```

### Adding API Routes

1. **Create API route:**

   ```typescript
   // app/api/users/route.ts
   export async function GET() {
     const users = await getUsersFromDatabase();
     return Response.json(users);
   }

   export async function POST(request: Request) {
     const body = await request.json();
     const user = await createUser(body);
     return Response.json(user, { status: 201 });
   }
   ```

2. **Create service:**
   ```typescript
   // services/userService.ts
   class UserService {
     async getUsers(): Promise<User[]> {
       const response = await fetch("/api/users");
       return response.json();
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

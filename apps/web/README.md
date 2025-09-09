# Web Application (Next.js)

A modern Next.js 15 web application with React 19, TypeScript, and Tailwind CSS v4.

## 🚀 Tech Stack

- **[Next.js 15.5.2](https://nextjs.org/)** - React framework with App Router and Turbopack
- **[React 19.1.0](https://react.dev/)** - Latest React with Server Components
- **[TypeScript 5](https://www.typescriptlang.org/)** - Full type safety
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Component library built on Radix UI
- **[React Hook Form 7.62.0](https://react-hook-form.com/)** - Performant forms
- **[Next Themes 0.4.6](https://github.com/pacocoursey/next-themes)** - Theme management

## 🎯 Features

### 🔐 Authentication System

- Demo login with `demo@example.com` / `password`
- Route protection with middleware
- Auth context with Zustand state management
- Complete auth flow (login, register, forgot password)

### 🎨 Modern UI/UX

- shadcn/ui component library with 20+ components
- Light/dark theme system with system preference detection
- Responsive design with mobile-first approach
- Loading states with skeleton loaders
- Toast notifications with Sonner
- Form validation with React Hook Form + Zod

### ⚡ Performance & Development

- Powered by Turbopack for lightning-fast builds
- TypeScript strict mode throughout
- Hot reload for instant feedback
- Bundle analysis with `npm run analyze`
- Code quality with ESLint and Prettier

## 📁 Project Structure

```
src/
├── app/                     # Next.js App Router
│   ├── (auth)/             # Authentication route group
│   │   ├── login/          # Login page
│   │   ├── register/       # Registration page
│   │   ├── forgot-password/# Password recovery
│   │   └── layout.tsx      # Auth layout
│   ├── api/                # API routes
│   │   └── health/         # Health check endpoint
│   ├── showcase/           # Component showcase (protected)
│   ├── profile/            # User profile (protected)
│   ├── privacy/            # Privacy policy
│   ├── terms/              # Terms of service
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Landing page
│   └── globals.css         # Global styles with Tailwind v4
├── components/             # React components
│   ├── features/           # Feature-specific components
│   │   ├── auth/           # Authentication components
│   │   ├── common/         # Shared components (navbar, theme toggle)
│   │   └── user/           # User management components
│   ├── providers/          # React context providers
│   └── ui/                 # shadcn/ui components
├── hooks/                  # Custom React hooks
│   ├── api/               # API-related hooks
│   ├── use-auth.ts        # Authentication hook
│   ├── use-theme.ts       # Theme management hook
│   └── use-toast.ts       # Toast notifications hook
├── lib/                   # Utility libraries
│   ├── icons.tsx          # Icon components
│   ├── logger.ts          # Logging service
│   └── utils.ts           # Utility functions (cn, etc.)
├── services/              # API services
│   ├── authService.ts     # Authentication API
│   └── userService.ts     # User management API
├── stores/                # Zustand state stores
│   └── auth-store.ts      # Authentication state
├── types/                 # TypeScript definitions
│   ├── api/               # API-related types
│   ├── common/            # Common utility types
│   ├── entities/          # Business entity types
│   └── ui/                # UI-related types
├── utils/                 # Utility functions
│   ├── api/               # API utilities
│   ├── auth/              # Authentication utilities
│   ├── security.ts        # Security utilities
│   └── validation.ts      # Validation schemas
└── middleware.ts          # Next.js middleware for auth & security
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (Latest LTS recommended)
- npm 10.2.4+

### Development

```bash
# Install dependencies (from root)
npm install

# Start development server
npm run dev:web

# Or from this directory
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
# Development
npm run dev              # Start Next.js development server
npm run build            # Build for production with Turbopack
npm run start            # Start production server
npm run analyze          # Analyze bundle size

# Code Quality
npm run lint             # Lint with ESLint
npm run lint:check       # Check linting without fixing
npm run lint:fix         # Fix linting issues
npm run typecheck        # Run TypeScript checks

# Utilities
npm run clean            # Clean build artifacts
npm run clean:deps       # Clean node_modules
```

## 🎮 Demo Walkthrough

### 1. Landing Page (`/`)

- Hero section with project overview
- Call-to-action buttons
- Theme toggle (light/dark mode)

### 2. Authentication Flow

**Login (`/login`)**

- Demo credentials: `demo@example.com` / `password`
- Form validation with React Hook Form + Zod
- Loading states and error handling

**Register (`/register`)**

- User registration form with validation
- Password strength requirements
- Terms acceptance checkbox

**Forgot Password (`/forgot-password`)**

- Password recovery form
- Email validation
- Success feedback

### 3. Protected Pages (Login Required)

**Showcase (`/showcase`)**

- Component library demonstration
- All shadcn/ui components showcased
- Interactive examples with code snippets

**Profile (`/profile`)**

- User profile management
- Account settings
- Logout functionality

### 4. Static Pages

- **Privacy Policy** (`/privacy`) - Complete privacy policy
- **Terms of Service** (`/terms`) - Terms and conditions

## 🔧 Configuration

### Environment Variables

Create `.env.local` in the web app directory:

```bash
# Authentication
AUTH_TOKEN_KEY=auth_token
NODE_ENV=development

# Add your API endpoints
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Next.js Configuration

Key configurations in `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react", "zustand"],
  },
  images: {
    formats: ["image/webp", "image/avif"],
  },
  poweredByHeader: false, // Security
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
};
```

### Tailwind CSS v4 Configuration

Global styles in `src/app/globals.css`:

```css
@import "tailwindcss";

@theme {
  --color-primary: hsl(221.2 83.2% 53.3%);
  --color-secondary: hsl(210 40% 98%);
  --color-background: hsl(0 0% 100%);
  --color-foreground: hsl(222.2 84% 4.9%);
  /* Complete design system */
}
```

### shadcn/ui Configuration

Components configuration in `components.json`:

```json
{
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

## 🔒 Security Features

### Middleware Protection

Route protection in `src/middleware.ts`:

```typescript
// Protected routes (require authentication)
const protectedRoutes = ["/showcase", "/profile"];

// Auth routes (redirect if already authenticated)
const authRoutes = ["/login", "/register", "/forgot-password"];
```

### Security Headers

- Content Security Policy (CSP)
- XSS Protection
- CSRF Protection (built-in Next.js)
- Secure headers via middleware

### Input Validation

- Zod schemas for all forms
- Server-side validation
- Client-side validation with React Hook Form

## 🎨 UI Components

### Available Components (shadcn/ui)

```typescript
// Form components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

// Layout components
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

// Navigation
import { NavigationMenu } from "@/components/ui/navigation-menu";
import { DropdownMenu } from "@/components/ui/dropdown-menu";

// Feedback
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
```

### Custom Feature Components

```typescript
// Authentication
import { LoginForm } from "@/components/features/auth/LoginForm";
import { RegisterForm } from "@/components/features/auth/RegisterForm";
import { AuthGuard } from "@/components/features/auth/AuthGuard";

// Common
import { Navbar } from "@/components/features/common/Navbar";
import { ThemeToggle } from "@/components/features/common/ThemeToggle";
import { UserDropdown } from "@/components/features/common/UserDropdown";

// User Management
import { UserProfile } from "@/components/features/user/UserProfile";
import { UsersList } from "@/components/features/user/UsersList";
```

## 📚 State Management

### Zustand Authentication Store

```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

// Usage
const { user, isAuthenticated, login, logout } = useAuthStore();
```

### Custom Hooks

```typescript
// Authentication
const { user, isAuthenticated, login, logout, isLoading } = useAuth();

// Theme management
const { theme, setTheme } = useTheme();

// Toast notifications
const { toast } = useToast();

// API requests
const { data, loading, error } = useApi(userService.getUsers);
```

## 🧪 Testing

Testing infrastructure is ready but needs implementation:

```bash
# Test commands (once implemented)
npm run test             # Run tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report
```

**Test Structure (to be implemented):**

```
__tests__/
├── components/          # Component tests
├── hooks/              # Hook tests
├── pages/              # Page tests
└── utils/              # Utility tests
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub/GitLab/Bitbucket
2. Import your repository on [Vercel](https://vercel.com)
3. Configure environment variables
4. Deploy with zero configuration

### Other Platforms

Works with any platform supporting Next.js:

- Netlify
- Cloudflare Pages
- AWS Amplify
- Railway
- DigitalOcean App Platform

### Build Optimization

```bash
# Analyze bundle size
npm run analyze

# Production build with Turbopack
npm run build

# Start production server
npm run start
```

## 🤝 Contributing

1. Make sure you're working from the root of the monorepo
2. Follow the established patterns for components and hooks
3. Use TypeScript strictly
4. Follow the ESLint and Prettier configurations
5. Test your changes with the demo authentication flow

## 📝 Related Documentation

- [Root README](../../README.md) - Monorepo overview
- [GUIDE](../../GUIDE.md) - Comprehensive development guide
- [Mobile App](../mobile/README.md) - React Native app documentation
- [Shared Package](../../packages/shared/README.md) - Shared code documentation

---

**Happy coding! 🚀**

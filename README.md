# Next.js Tailwind Starter

A modern, production-ready Next.js starter template built with the latest technologies and best practices for 2025.

## 🚀 Tech Stack

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router and Turbopack
- **[React 19](https://react.dev/)** - Latest React with Server Components
- **[TypeScript](https://www.typescriptlang.org/)** - Full type safety with strict configuration
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Utility-first styling with CSS-first configuration
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautifully designed components built with Radix UI
- **[next-intl](https://next-intl-docs.vercel.app/)** - Type-safe internationalization for Next.js
- **[Zustand](https://zustand.docs.pmnd.rs/)** - Lightweight state management (~1KB)
- **[React Hook Form](https://react-hook-form.com/)** - Performant forms with easy validation
- **[Zod](https://zod.dev/)** - TypeScript-first schema validation
- **Modern Tooling** - ESLint 9, Prettier, Husky, Lint-staged, Jest

## ✨ Features

### 🎨 Typography & Design System

- **System Fonts** - Commercial-safe font stack with optimal performance (no external dependencies)
- **Responsive Typography** - Perfect font rendering across all platforms and devices
- **Font Stack**: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
- **Monospace Fonts**: `ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace`

### 🔐 Authentication System

- **Demo Login** - Pre-configured with demo credentials (`demo@example.com` / `password`)
- **Route Protection** - Middleware-based auth with automatic redirects
- **Auth Context** - Global authentication state management with Zustand
- **Protected Pages** - Showcase and profile pages require authentication
- **Complete Auth Flow** - Login, register, and forgot password pages with validation

### 🌐 Internationalization (i18n)

- **Multi-language Support** - English, Chinese Simplified, and Bahasa Melayu
- **Type-safe Translations** - Full TypeScript support with autocompletion
- **Locale-based Routing** - URLs automatically prefixed with language codes (`/en`, `/zh`, `/ms`)
- **Language Switcher** - Multiple UI variants (dropdown, select, buttons) with flags
- **SEO Optimized** - Proper hreflang attributes and locale-specific meta tags
- **next-intl Integration** - Industry-standard i18n solution for Next.js

### 🎨 Modern UI/UX

- **shadcn/ui Components** - Professional component library with Radix UI primitives
- **Theme System** - Light/dark mode with system preference detection
- **Responsive Design** - Mobile-first approach with Tailwind CSS v4
- **Loading States** - Skeleton loaders and error boundaries
- **Toast Notifications** - User feedback with Sonner
- **Form Validation** - React Hook Form + Zod integration

### ⚡ Performance & Development

- **Lightning Fast** - Powered by Turbopack and Next.js 15 optimizations
- **TypeScript** - Strict type safety throughout the codebase
- **Hot Reload** - Instant feedback during development
- **Code Quality** - ESLint 9, Prettier, and pre-commit hooks (Husky)
- **Testing Ready** - Jest setup with React Testing Library

### 🛡️ Security & Production

- **Security Headers** - Comprehensive middleware with CSP, XSS protection
- **Environment Management** - Secure environment variable handling
- **Production Build** - Optimized builds with bundle analysis
- **SEO Ready** - Metadata configuration and semantic HTML

## 📁 Project Structure

```
src/
├── app/                           # Next.js App Router (Pages)
│   ├── [locale]/                 # Locale-based routing (i18n)
│   │   ├── (auth)/               # Authentication route group
│   │   │   ├── login/            # Login page with form validation
│   │   │   ├── register/         # Registration page
│   │   │   ├── forgot-password/  # Password recovery
│   │   │   └── layout.tsx        # Auth-specific layout
│   │   ├── showcase/             # Protected component showcase page
│   │   ├── profile/              # User profile management
│   │   ├── privacy/              # Privacy policy page
│   │   ├── terms/                # Terms of service page
│   │   ├── layout.tsx            # Locale layout with i18n providers
│   │   └── page.tsx              # Landing page with translations
│   ├── api/                      # API routes
│   │   └── health/               # Health check endpoint
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles with Tailwind v4
├── i18n/
│   └── config.ts                 # i18n configuration with next-intl
├── messages/                     # Translation files
│   ├── en/                       # English translations (default)
│   │   ├── common.json           # Navigation, actions, theme, language
│   │   ├── auth.json             # Authentication flows
│   │   ├── pages.json            # Page-specific content
│   │   └── index.ts              # Export all translations
│   ├── zh/                       # Chinese Simplified translations
│   │   ├── common.json
│   │   ├── auth.json
│   │   ├── pages.json
│   │   └── index.ts
│   └── ms/                       # Bahasa Melayu translations
│       ├── common.json
│       ├── auth.json
│       ├── pages.json
│       └── index.ts
├── components/                   # React components
│   ├── ui/                       # shadcn/ui base components
│   │   ├── button.tsx            # Button with multiple variants
│   │   ├── card.tsx              # Card container components
│   │   ├── form.tsx              # Form components with validation
│   │   ├── input.tsx             # Input components
│   │   ├── loading.tsx           # Loading spinners and skeletons
│   │   ├── dialog.tsx            # Modal/dialog components
│   │   ├── dropdown-menu.tsx     # Dropdown menu components
│   │   ├── navigation-menu.tsx   # Navigation components
│   │   ├── sonner.tsx            # Toast notification setup
│   │   ├── error-boundary.tsx    # Error handling wrapper
│   │   └── [20+ more components] # Complete UI library
│   ├── features/                 # Feature-specific components
│   │   ├── auth/                 # Authentication components
│   │   │   ├── AuthGuard.tsx     # Route protection wrapper
│   │   │   ├── LoginForm.tsx     # Login form with validation
│   │   │   └── RegisterForm.tsx  # Registration form
│   │   ├── common/               # Shared feature components
│   │   │   ├── Navbar.tsx        # Navigation bar with language switcher
│   │   │   ├── ThemeToggle.tsx   # Dark/light mode switcher
│   │   │   └── UserDropdown.tsx  # User menu dropdown
│   │   ├── i18n/                 # Internationalization components
│   │   │   ├── LocaleSwitcher.tsx # Language switching component
│   │   │   └── index.ts          # i18n exports
│   │   └── user/                 # User management components
│   │       ├── UserProfile.tsx   # Profile management UI
│   │       └── UsersList.tsx     # User listing component
│   └── providers/                # Context providers
│       ├── auth-initializer.tsx  # Authentication initialization
│       └── theme-provider.tsx    # Theme context provider
├── hooks/                        # Custom React hooks
│   ├── api/                      # API-related hooks
│   │   ├── useApi.ts             # Generic API hook
│   │   └── __tests__/            # Hook tests
│   ├── use-auth.ts               # Authentication hook
│   ├── use-theme.ts              # Theme management hook
│   └── use-toast.ts              # Toast notifications hook
├── lib/                          # Utility libraries
│   ├── utils.ts                  # General utilities and cn() helper
│   ├── icons.tsx                 # Icon components (Lucide React)
│   └── logger.ts                 # Logging utilities
├── utils/                        # Helper functions
│   ├── api/                      # API utilities
│   │   ├── client.ts             # HTTP client configuration
│   │   └── helpers.ts            # API helper functions
│   ├── auth/                     # Authentication utilities
│   │   └── tokenManager.ts      # Token management
│   ├── security.ts               # Security utilities
│   └── validation.ts             # Validation helpers
├── types/                        # TypeScript type definitions
│   ├── api/                      # API-related types
│   │   ├── auth.ts               # Authentication types
│   │   ├── users.ts              # User types
│   │   └── common.ts             # Common API types
│   ├── entities/                 # Domain entity types
│   │   └── user.ts               # User entity definitions
│   ├── ui/                       # UI-related types
│   │   └── theme.ts              # Theme types
│   ├── i18n.ts                   # i18n type definitions and translation keys
│   └── common/                   # Common utility types
├── services/                     # External services
│   ├── authService.ts            # Authentication API service
│   └── userService.ts            # User management service
├── stores/                       # Zustand state stores
│   └── auth-store.ts             # Authentication state management
├── config/                       # Configuration
│   └── env.ts                    # Environment variables
├── constants/                    # Application constants
│   └── api.ts                    # API constants
├── test/                         # Test configuration
│   └── setup.ts                  # Jest setup file
└── middleware.ts                 # Next.js middleware for auth & security
```

### Key Files & Their Purposes:

**🔐 Authentication & Security**

- **`middleware.ts`** - Route protection, auth redirects, security headers
- **`(auth)/*`** - Authentication pages with form validation
- **`stores/auth-store.ts`** - Authentication state management with Zustand
- **`components/features/auth/`** - Authentication components and forms

**🎨 UI & Components**

- **`components/ui/*`** - shadcn/ui components with Tailwind variants
- **`components/features/`** - Feature-specific components organized by domain
- **`components/providers/`** - React context providers for global state

**🔧 Configuration & Utils**

- **`config/env.ts`** - Centralized environment variable management
- **`types/*`** - Comprehensive TypeScript definitions
- **`utils/*`** - Helper functions organized by domain
- **`lib/utils.ts`** - Core utilities including cn() for class merging

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Windows Development Notes

If you encounter permission errors with Turbopack on Windows:

1. **Use Webpack fallback**: Run `npm run dev:webpack` instead of `npm run dev`
2. **Clean build files**: Use `rmdir /s /q .next` to clear build cache
3. **Port conflicts**: The dev server will automatically use an available port (e.g., 3002)

For builds that timeout, consider using `npm run build:webpack` as an alternative to the Turbopack build.

### Installation

1. **Clone or download this starter:**

   ```bash
   git clone <your-repo-url>
   cd nextjs-tailwind-starter
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables:**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your configuration values.

4. **Run the development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

   The application will automatically redirect you to `/en` (English). You can access other languages:
   - **English**: [http://localhost:3000/en](http://localhost:3000/en)
   - **Chinese**: [http://localhost:3000/zh](http://localhost:3000/zh)
   - **Malay**: [http://localhost:3000/ms](http://localhost:3000/ms)

### 🎮 Try the Demo

The application includes a demo authentication system:

- **Email:** `demo@example.com`
- **Password:** `password`

**Available Demo Pages:**

- **Landing Page** (`/`) - Hero section with project overview
- **Login** (`/login`) - Authentication with demo credentials and form validation
- **Register** (`/register`) - User registration form with validation
- **Showcase** (`/showcase`) - Protected component showcase page (requires login)
- **Profile** (`/profile`) - User profile management (requires login)

## 📜 Available Scripts

| Script                  | Description                                              |
| ----------------------- | -------------------------------------------------------- |
| `npm run dev`           | Start development server with Turbopack                  |
| `npm run dev:webpack`   | Start development server with Webpack (Windows fallback) |
| `npm run build`         | Build for production with Turbopack                      |
| `npm run build:webpack` | Build for production with Webpack (Windows fallback)     |
| `npm run start`         | Start production server                                  |
| `npm run lint`          | Run ESLint with auto-fix                                 |
| `npm run lint:check`    | Check ESLint issues without fixing                       |
| `npm run format`        | Format code with Prettier                                |
| `npm run format:check`  | Check formatting without fixing                          |
| `npm run typecheck`     | Run TypeScript type checking                             |
| `npm run analyze`       | Analyze bundle size                                      |
| `npm run clean`         | Clean build outputs                                      |
| `npm run clean:modules` | Clean and reinstall node modules                         |
| `npm run check-all`     | Run all quality checks (lint, type)                      |
| `npm run prepare`       | Setup Husky git hooks                                    |

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# Authentication
AUTH_TOKEN_KEY=auth_token
NODE_ENV=development

# Add your API endpoints, database URLs, etc.
```

### Tailwind CSS v4

This starter uses Tailwind CSS v4 with CSS-first configuration in `src/app/globals.css`:

```css
@import 'tailwindcss';

@theme {
  --color-primary: hsl(221.2 83.2% 53.3%);
  --color-secondary: hsl(210 40% 98%);
  --color-background: hsl(0 0% 100%);
  --color-foreground: hsl(222.2 84% 4.9%);
  /* Complete design system with CSS custom properties */
}
```

### shadcn/ui Configuration

Components are configured in `components.json`:

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

### Middleware Configuration

Route protection, security headers, and i18n routing in `src/middleware.ts`:

```typescript
// Protected routes (require authentication)
const protectedRoutes = ['/showcase', '/profile']

// Auth routes (redirect if already authenticated)
const authRoutes = ['/login', '/register', '/forgot-password']

// Supported locales
const locales = ['en', 'zh', 'ms']
```

### TypeScript Configuration

Path aliases configured in `tsconfig.json`:

```typescript
"paths": {
  "@/*": ["./src/*"]
}
```

## 🎨 Components

### UI Components (shadcn/ui)

Professional component library in `src/components/ui/`:

- **Button** - Multiple variants with loading states
- **Card** - Container components with headers and footers
- **Form** - Complete form system with React Hook Form + Zod
- **Input** - Text inputs with validation states
- **Dialog** - Modal dialogs and drawers
- **Dropdown Menu** - Context menus and dropdowns
- **Navigation Menu** - Complex navigation components
- **Toast** - Notification system with Sonner
- **And 15+ more components** - Complete UI toolkit

### Internationalization Components

Multi-language support components in `src/components/features/i18n/`:

- **LocaleSwitcher** - Language switching with multiple variants
  ```tsx
  <LocaleSwitcher variant="dropdown" size="sm" />
  <LocaleSwitcher variant="select" showLabel />
  <LocaleSwitcher variant="buttons" />
  ```

### Feature Components

Domain-specific components in `src/components/features/`:

- **Authentication** - Login/register forms with validation
- **Common** - Shared components like navbar, theme toggle
- **User Management** - Profile and user list components

## 🌐 Internationalization Usage

### Using Translations in Components

```tsx
import { useTranslations } from 'next-intl'

function MyComponent() {
  const t = useTranslations('common.navigation')
  return <span>{t('home')}</span> // Returns: "Home" | "首页" | "Utama"
}

// Namespace examples:
// - common.navigation.home
// - common.actions.submit
// - auth.login.title
// - pages.home.title
```

### Translation File Structure

- **`messages/en/common.json`** - Navigation, actions, status, theme, language
- **`messages/en/auth.json`** - Login, register, forgot password, logout
- **`messages/en/pages.json`** - Home, profile, showcase, privacy, terms, 404

### Adding New Languages

1. Create new folder in `messages/` (e.g., `messages/fr/`)
2. Add locale to `src/i18n/config.ts`
3. Update `LocaleSwitcher` component with new language
4. Create translation files matching the existing structure

## 🌙 Theme System

Complete theme system with:

- Light and dark mode support
- System preference detection
- Smooth transitions between themes
- CSS custom properties for easy customization
- shadcn/ui design tokens integration

## 📦 State Management

### Zustand Benefits

- ~1KB bundle size
- TypeScript integration
- DevTools support
- Persistence capabilities
- SSR compatibility
- Simple and intuitive API

### Authentication Store Example

```typescript
interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  isAuthenticated: false,
  login: async credentials => {
    // Authentication logic
  },
  logout: () => {
    // Logout logic
  },
}))
```

## 🔒 Security Features

- **CSP Headers** - Content Security Policy protection
- **XSS Prevention** - Cross-site scripting protection
- **CSRF Protection** - Built-in Next.js CSRF protection
- **Secure Headers** - Security headers via middleware
- **Environment Variables** - Secure configuration management
- **Input Validation** - Zod schema validation throughout

## 🧪 Testing

Jest setup with React Testing Library:

- **Unit Tests** - Component and hook testing
- **Integration Tests** - Feature testing
- **Coverage Reports** - Track test coverage
- **Watch Mode** - Development testing workflow

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub/GitLab/Bitbucket
2. Import your repository on [Vercel](https://vercel.com)
3. Deploy with zero configuration

### Other Platforms

Works with any platform supporting Next.js:

- Netlify
- Cloudflare Pages
- AWS Amplify
- Railway
- DigitalOcean App Platform

### Build Optimization

- **Bundle Analysis** - `npm run analyze` for bundle insights
- **Turbopack** - Faster builds and development
- **Tree Shaking** - Automatic dead code elimination
- **Code Splitting** - Automatic route-based splitting

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

Built with these amazing technologies:

- [Next.js](https://nextjs.org/) - The React Framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [next-intl](https://next-intl-docs.vercel.app/) - Internationalization
- [Zustand](https://zustand.docs.pmnd.rs/) - State management
- [React Hook Form](https://react-hook-form.com/) - Form handling
- [Zod](https://zod.dev/) - Schema validation
- [TypeScript](https://www.typescriptlang.org/) - Type safety

---

## 📊 Project Status

### ✅ Current State (September 2024)

- **✅ Build Status**: Development server working (use webpack fallback on Windows)
- **✅ Type Safety**: All TypeScript checks passing
- **✅ Code Quality**: ESLint passing with minor warnings only
- **✅ Dependencies**: All packages up-to-date with 0 vulnerabilities
- **✅ i18n Implementation**: Complete 3-language support (EN/ZH/MS)
- **✅ Authentication**: Demo system fully functional
- **✅ Security**: Comprehensive middleware with CSP headers
- **✅ SEO**: Advanced metadata and structured data implementation

### 🔧 Recent Optimizations

- **✅ Font System**: Replaced Google Fonts with system fonts for commercial safety and better performance
- **✅ ESLint Fixes**: Resolved Google Fonts preconnect warning (21→20 warnings)
- **✅ Windows Compatibility**: Enhanced development experience with fallback commands
- **✅ Environment Setup**: Comprehensive `.env.example` with all configuration options
- **✅ Security Headers**: Optimized CSP policies and middleware
- **✅ Loading States**: Improved error boundary and user feedback

### ⚠️ Known Issues

- Turbopack permission issues on Windows (use webpack fallback)
- Some TypeScript `any` types that could be more specific (non-breaking, 20 ESLint warnings)

---

**Happy coding! 🚀**

For detailed usage instructions and code explanations, see [GUIDE.md](./GUIDE.md).

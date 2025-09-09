# NextJS + React Native Monorepo Starter

A modern monorepo starter with Next.js web app and React Native mobile app sharing common code.

## 🚀 Tech Stack

### **Web Application (Next.js)**

- **[Next.js 15.5.2](https://nextjs.org/)** - React framework with App Router and Turbopack
- **[React 19.1.0](https://react.dev/)** - Latest React with Server Components
- **[TypeScript 5](https://www.typescriptlang.org/)** - Full type safety with strict configuration
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Utility-first styling with CSS-first configuration
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautifully designed components built with Radix UI
- **[React Hook Form](https://react-hook-form.com/)** - Performant forms with easy validation

### **Mobile Application (React Native)**

- **[Expo 53.0.22](https://expo.dev/)** - React Native platform with managed workflow
- **[React Native 0.79.6](https://reactnative.dev/)** - Cross-platform mobile development
- **[NativeWind 4.0.1](https://www.nativewind.dev/)** - Tailwind CSS for React Native
- **[React Navigation 7](https://reactnavigation.org/)** - Navigation library for React Native

### **Shared Libraries & Tools**

- **[Zustand 5.0.8](https://zustand.docs.pmnd.rs/)** - Lightweight state management (~1KB)
- **[Zod 4.1.5](https://zod.dev/)** - TypeScript-first schema validation
- **[Turborepo 2.2.3](https://turbo.build/)** - High-performance build system for monorepos
- **Modern Tooling** - ESLint 8, Prettier, Husky, Lint-staged

## ✨ Features

### 🔐 Authentication System

- **Demo Login** - Pre-configured with demo credentials (`demo@example.com` / `password`)
- **Route Protection** - Middleware-based auth with automatic redirects
- **Auth Context** - Global authentication state management with Zustand
- **Protected Pages** - Showcase and profile pages require authentication
- **Complete Auth Flow** - Login, register, and forgot password pages with validation

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
- **Testing Ready** - Jest configuration ready for implementation

### 🛡️ Security & Production

- **Security Headers** - Comprehensive middleware with CSP, XSS protection
- **Environment Management** - Secure environment variable handling
- **Production Build** - Optimized builds with bundle analysis
- **SEO Ready** - Metadata configuration and semantic HTML

## 📁 Project Structure

```
├── apps/
│   ├── web/                      # Next.js Web Application
│   │   ├── src/app/             # Next.js App Router (Pages)
│   │   │   ├── (auth)/          # Authentication route group
│   │   │   ├── api/             # API routes
│   │   │   ├── showcase/        # Protected component showcase
│   │   │   ├── profile/         # User profile management
│   │   │   ├── layout.tsx       # Root layout with providers
│   │   │   ├── page.tsx         # Landing page
│   │   │   └── globals.css      # Global styles with Tailwind v4
│   │   ├── src/components/      # Web-specific React components
│   │   ├── src/hooks/           # Web-specific hooks
│   │   └── package.json         # Web app dependencies
│   └── mobile/                   # React Native Mobile App
│       ├── App.tsx              # Main mobile app component
│       ├── src/components/      # Mobile-specific components
│       ├── tailwind.config.js   # NativeWind configuration
│       ├── babel.config.js      # Babel config for NativeWind
│       └── package.json         # Mobile app dependencies
├── packages/
│   └── shared/                   # Shared Code Package
│       ├── src/services/        # API clients and business logic
│       ├── src/types/           # TypeScript definitions
│       ├── src/utils/           # Common utilities
│       ├── src/stores/          # Zustand state stores
│       ├── src/constants/       # App constants
│       ├── src/hooks/           # Shared hooks
│       ├── src/index.ts         # Package entry point
│       └── package.json         # Shared package dependencies
├── package.json                  # Root monorepo configuration
├── turbo.json                    # Turborepo configuration
└── tsconfig.json                 # TypeScript project references
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

- **Node.js 18+** (Latest LTS recommended)
- **npm 10.2.4+** (as specified in packageManager)
- **Expo CLI** (for mobile development): `npm install -g @expo/cli`
- **EAS CLI** (for building): `npm install -g eas-cli`

### Installation

```bash
# Install dependencies
npm install

# Start both apps in development
npm run dev

# Or start individually
npm run dev:web     # Web app (http://localhost:3000)
npm run dev:mobile  # Mobile app (Expo)
```

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

## 🛠 Available Commands

```bash
# Development
npm run dev                 # Start both apps
npm run dev:web            # Start web app only (http://localhost:3000)
npm run dev:mobile         # Start mobile app with Expo

# Building
npm run build              # Build both apps
npm run build:web          # Build web app with Turbopack
npm run build:mobile       # Build mobile app with EAS

# Mobile Development
npm run mobile:android     # Run on Android device/emulator
npm run mobile:ios         # Run on iOS device/simulator
npm run mobile:reset       # Clear Expo cache and restart

# Code Quality
npm run lint               # Lint all packages
npm run lint:fix           # Fix linting issues
npm run typecheck          # Run TypeScript checks
npm run format             # Format code with Prettier
npm run format:check       # Check code formatting
npm run check-all          # Run lint and typecheck together

# Utilities
npm run clean              # Clean all build artifacts and dependencies
npm run clean:cache        # Clean Turbo cache only
npm run clean:deps         # Clean node_modules only
npm run fresh              # Clean everything and reinstall
```

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
@import "tailwindcss";

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

Route protection and security headers in `src/middleware.ts`:

```typescript
// Protected routes (require authentication)
const protectedRoutes = ["/showcase", "/profile"];

// Auth routes (redirect if already authenticated)
const authRoutes = ["/login", "/register", "/forgot-password"];
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

### Feature Components

Domain-specific components in `src/components/features/`:

- **Authentication** - Login/register forms with validation
- **Common** - Shared components like navbar, theme toggle
- **User Management** - Profile and user list components

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
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (credentials) => {
    // Authentication logic
  },
  logout: () => {
    // Logout logic
  },
}));
```

## 🔒 Security Features

- **CSP Headers** - Content Security Policy protection
- **XSS Prevention** - Cross-site scripting protection
- **CSRF Protection** - Built-in Next.js CSRF protection
- **Secure Headers** - Security headers via middleware
- **Environment Variables** - Secure configuration management
- **Input Validation** - Zod schema validation throughout

## 🧪 Testing

Testing infrastructure is configured but needs implementation:

- **Jest Configuration** - Ready for unit and integration tests
- **React Testing Library** - Component testing framework available
- **Test Scripts** - `npm run test` and `npm run test:web`/`npm run test:mobile`
- **Coverage** - Ready to track test coverage once tests are implemented

> **Note**: Test files need to be created. Infrastructure is ready in `/package.json` scripts.

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
- [Zustand](https://zustand.docs.pmnd.rs/) - State management
- [React Hook Form](https://react-hook-form.com/) - Form handling
- [Zod](https://zod.dev/) - Schema validation
- [TypeScript](https://www.typescriptlang.org/) - Type safety

---

**Happy coding! 🚀**

For detailed usage instructions and code explanations, see [GUIDE.md](./GUIDE.md).

---

## 📱 Mobile Development

### Expo Development

```bash
# Start development server
npm run dev:mobile

# Run on specific platforms
expo start --android    # Android device/emulator
expo start --ios        # iOS device/simulator
expo start --web        # Web browser (for testing)

# Clear cache if needed
expo start --clear
```

### Building for Production

```bash
# Build for all platforms
npm run build:mobile

# Build for specific platforms
eas build --platform android
eas build --platform ios
```

### Mobile-Specific Features

- **NativeWind** - Tailwind CSS styling for React Native
- **React Navigation** - Stack navigation with type safety
- **Expo managed workflow** - Simplified development and building
- **Shared codebase** - Business logic shared with web app

---

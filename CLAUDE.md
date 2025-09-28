# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🚀 Common Development Commands

### Development & Build

```bash
# Start development server (Turbopack - recommended)
npm run dev

# Start with Webpack (Windows fallback if Turbopack issues)
npm run dev:webpack

# Production build
npm run build

# Start production server
npm run start

# Preview (build + start)
npm run preview
```

### Code Quality & Testing

```bash
# Lint and fix issues
npm run lint

# Check lint without fixing
npm run lint:check

# Format code with Prettier
npm run format

# Check formatting
npm run format:check

# TypeScript type checking
npm run typecheck

# Run all quality checks
npm run check-all
```

### Bundle Analysis & Performance

```bash
# Analyze bundle size
npm run analyze

# Server bundle analysis
npm run analyze:server

# Browser bundle analysis
npm run analyze:browser
```

### PWA Asset Generation

```bash
# Generate PWA icons from SVG
npm run pwa:icons

# Generate iOS splash screens
npm run pwa:splash

# Generate all PWA assets (icons + splash)
npm run pwa:assets
```

### Maintenance

```bash
# Clean build files
npm run clean

# Clean and reinstall dependencies
npm run clean:modules
```

## 🏗️ High-Level Architecture

This is a modern Next.js 15 starter with enterprise-grade features and mobile-first PWA design.

### Core Tech Stack

- **Next.js 15** with App Router and Turbopack
- **React 19** with Server Components
- **TypeScript** strict mode with comprehensive types
- **Tailwind CSS v4** with CSS-first configuration
- **shadcn/ui** component library built on Radix UI
- **next-intl** for internationalization (EN, ZH, MS)
- **Zustand** for lightweight state management
- **next-pwa** for Progressive Web App features

### Project Structure Pattern

```
src/
├── app/                     # Next.js App Router pages
│   ├── [locale]/           # Internationalized routes (en, zh, ms)
│   ├── api/                # API endpoints
│   └── globals.css         # Tailwind v4 CSS-first config
├── components/
│   ├── ui/                 # shadcn/ui base components
│   ├── features/           # Feature-specific components
│   └── providers/          # Context providers
├── hooks/                  # Custom React hooks
├── lib/                    # Core utilities (utils.ts, logger.ts)
├── services/               # API services (auth, user)
├── stores/                 # Zustand state stores
├── types/                  # TypeScript definitions
├── utils/                  # Helper functions & security utils
├── config/                 # Environment & API configuration
└── middleware.ts           # Security, auth, i18n routing
```

### Key Architectural Decisions

#### Authentication System

- **Token-based**: JWT stored in HTTP-only cookies
- **Route protection**: Middleware-based with automatic redirects
- **Demo mode**: Uses `demo@example.com` / `password` for testing
- **State management**: Zustand store with persistence
- **Protected routes**: `/showcase`, `/profile`, `/dashboard`

#### Internationalization (i18n)

- **Flat JSON structure**: `messages/en.json`, `messages/zh.json`, `messages/ms.json`
- **Route-based locales**: `/en/*`, `/zh/*`, `/ms/*`
- **Component patterns**:
  - Client: `useTranslations()` + `Link` from `@/i18n/navigation`
  - Server: `getTranslations()` + standard anchor tags

#### Security Implementation

- **Multi-layer middleware**: Rate limiting, security headers, OWASP compliance
- **Input sanitization**: DOMPurify integration with multiple security levels
- **CSP headers**: Production-ready Content Security Policy
- **Token management**: Auto-refresh with rotation for enhanced security

#### Error Handling System

- **Error boundaries**: Strategic placement on critical components
- **Automatic retry**: Up to 3 attempts with exponential backoff
- **Error reporting**: Sentry-ready with unique error IDs
- **Development vs Production**: Different error UIs for debugging vs user experience

#### PWA & Mobile-First Design

- **Complete PWA setup**: Manifest, service worker, install prompts
- **Asset generation**: Automated icon and splash screen generation
- **Mobile optimization**: Touch targets ≥44px, mobile-friendly forms
- **Offline support**: Comprehensive caching strategies

### State Management Architecture

- **Local state first**: useState for component-specific data
- **Zustand for global state**: Authentication, theme, user preferences
- **No Redux**: Deliberately chosen Zustand for simplicity and performance
- **Persistent stores**: User settings, theme preferences persist across sessions

## 🎯 Development Patterns & Rules

### File and Component Conventions

#### Component Creation

```bash
# Add new shadcn/ui components
npx shadcn@latest add [component-name]

# Available components: button, card, dialog, input, badge, alert, toast,
# dropdown-menu, navigation-menu, tabs, form, select, checkbox, etc.
```

#### Component Structure

- **UI components**: `src/components/ui/` - shadcn/ui base components
- **Feature components**: `src/components/features/[domain]/` - domain-specific components
- **Naming**: Use PascalCase for components, kebab-case for files
- **Example**: `UserProfile.tsx` component, `user-profile.tsx` file

#### Import Patterns

```typescript
// Absolute imports using @ alias
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'

// Feature components
import { UserProfile } from '@/components/features/user/UserProfile'
```

### Critical Development Rules

#### 1. Internationalization (i18n) - MANDATORY

```typescript
// ❌ NEVER hardcode text
<button>Submit</button>

// ✅ ALWAYS use translations
const t = useTranslations('common.actions')
<button>{t('submit')}</button>

// ✅ Server components
const t = await getTranslations('pages.home')
```

#### 2. TypeScript - NO ANY TYPES

```typescript
// ❌ NEVER use any
const userData: any = await fetch('/api/users')

// ✅ ALWAYS define proper types
interface UserData {
  id: string
  name: string
  email: string
}
const userData: UserData = await fetch('/api/users')
```

#### 3. Mobile-First Design - MANDATORY

```typescript
// ✅ Touch targets ≥ 44px
<button className="min-h-11 min-w-11 p-3 touch-manipulation">

// ✅ Mobile-optimized forms
<input
  type="email"
  inputMode="email"
  autoComplete="email"
  className="text-base" // Prevents zoom on iOS
/>

// ✅ Responsive grid (mobile-first)
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

#### 4. Component Patterns

```typescript
// ✅ Client Component with i18n
'use client'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

export function ClientComponent() {
  const t = useTranslations('common.navigation')
  return <Link href="/showcase">{t('showcase')}</Link>
}

// ✅ Server Component with i18n
import { getTranslations } from 'next-intl/server'

export default async function ServerPage() {
  const t = await getTranslations('pages.home')
  return <h1>{t('title')}</h1>
}
```

### Adding New Features

#### 1. New Pages

```typescript
// 1. Create page file: src/app/[locale]/new-page/page.tsx
export default async function NewPage() {
  const t = await getTranslations('pages.newPage')
  return <div>{t('title')}</div>
}

// 2. Add translations to all language files
// messages/en.json, messages/zh.json, messages/ms.json
{
  "pages": {
    "newPage": {
      "title": "New Page"
    }
  }
}

// 3. Update navigation if needed
// src/components/features/common/Navbar.tsx

// 4. Protect route if needed (add to middleware.ts)
const PROTECTED_ROUTES = ['/showcase', '/profile', '/new-page']
```

#### 2. New API Routes

```typescript
// 1. Create: src/app/api/new-endpoint/route.ts
export async function GET() {
  // Implementation
  return Response.json({ data: 'success' })
}

// 2. Create service: src/services/newService.ts
class NewService {
  async getData() {
    const response = await fetch('/api/new-endpoint')
    return response.json()
  }
}

// 3. Add to services index: src/services/index.ts
export { NewService } from './newService'
```

#### 3. New Components

```typescript
// 1. Create component file
// src/components/features/[domain]/NewComponent.tsx

// 2. Add proper TypeScript interface
interface NewComponentProps {
  title: string
  onAction: () => void
}

// 3. Implement with i18n
export function NewComponent({ title, onAction }: NewComponentProps) {
  const t = useTranslations('components.newComponent')

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={onAction}>{t('action')}</Button>
      </CardContent>
    </Card>
  )
}

// 4. Add translations to all language files
```

### Environment & Configuration

#### Environment Variables

```bash
# Development
NODE_ENV=development
AUTH_TOKEN_KEY=auth_token

# Add new variables to:
# - .env.local (local development)
# - .env.example (template)
# - src/config/env.ts (type definitions)
```

#### Configuration Files

- **TypeScript**: `tsconfig.json` - path aliases configured
- **ESLint**: `eslint.config.mjs` - Next.js + TypeScript rules
- **Prettier**: `package.json` lint-staged section
- **Tailwind**: `src/app/globals.css` - CSS-first configuration
- **Next.js**: `next.config.ts` - PWA, i18n, performance optimizations

## 🔧 Common Development Tasks

### Running Tests

```bash
# Note: Testing infrastructure is planned but not yet implemented
# Priority: Focus on business logic testing over UI testing

# When implemented:
# npm run test              # Run all tests
# npm run test:watch        # Watch mode
# npm run test:coverage     # Coverage report
```

### Code Quality Workflow

```bash
# Before committing (automated via Husky):
npm run lint              # Fix code issues
npm run typecheck         # Check TypeScript
npm run format            # Format with Prettier

# Full quality check:
npm run check-all         # Runs lint:check + typecheck
```

### Debugging & Development

```bash
# If Turbopack has issues (Windows):
npm run dev:webpack       # Fallback to Webpack

# Clean build issues:
npm run clean             # Remove .next, out, build
npm run clean:modules     # Full dependency reinstall

# Bundle analysis:
npm run analyze           # Overall bundle analysis
```

## 🚨 Critical Development Rules

### 1. Always Use Translations

```typescript
// ❌ NEVER hardcode text
<button>Submit</button>

// ✅ ALWAYS use translations (update all 3 language files)
const t = useTranslations('common.actions')
<button>{t('submit')}</button>
```

### 2. TypeScript Strict Mode

```typescript
// ❌ NO any types allowed
const data: any = response.json()

// ✅ Define proper interfaces
interface ApiResponse {
  id: string
  name: string
}
const data: ApiResponse = response.json()
```

### 3. Mobile-First Mandatory

```typescript
// ✅ All interactive elements ≥ 44px touch targets
<button className="min-h-11 min-w-11 p-3">

// ✅ Mobile-optimized forms
<input
  type="email"
  inputMode="email"
  className="text-base" // Prevents iOS zoom
/>
```

### 4. Component Error Boundaries

```typescript
// ✅ Wrap complex components
<ErrorBoundary componentName="UserProfile">
  <UserProfile />
</ErrorBoundary>
```

## 🐛 Troubleshooting Guide

### Common Issues

#### TypeScript Errors

```bash
# Fix most TypeScript issues:
npm run typecheck
# Check import/export statements, interface implementations
```

#### Build Failures

```bash
# Turbopack issues (especially Windows):
npm run dev:webpack       # Use Webpack instead
npm run build:webpack     # Build with Webpack

# Clear cache:
npm run clean
```

#### Authentication Problems

- Check middleware configuration in `src/middleware.ts`
- Verify protected routes array includes your route
- Ensure auth token is stored in cookies correctly
- Demo credentials: `demo@example.com` / `password`

#### i18n Issues

- Check all 3 language files have the same keys: `messages/en.json`, `messages/zh.json`, `messages/ms.json`
- Verify translation key paths match usage: `useTranslations('common.actions')`
- Server vs Client component patterns (don't mix `useTranslations` and `getTranslations`)

#### PWA Problems

```bash
# Regenerate PWA assets:
npm run pwa:assets

# Check manifest.json and service worker registration
# Verify icons exist in public/ folder
```

### Performance Issues

```bash
# Check bundle size:
npm run analyze

# Performance monitoring:
# - Use React DevTools
# - Check Core Web Vitals
# - Monitor bundle chunks
```

## 📋 Quality Checklist

Before implementing any feature:

- [ ] **Mobile layout works first** (touch targets ≥44px)
- [ ] **All text uses translations** (all 3 languages updated)
- [ ] **TypeScript interfaces defined** (no `any` types)
- [ ] **Error boundaries added** for complex components
- [ ] **Loading states implemented** for async operations
- [ ] **Security headers respected** (no inline scripts/styles in production)

## 📚 Documentation References

- **Comprehensive guide**: [GUIDE.md](./GUIDE.md) - detailed implementation tutorials
- **Project overview**: [README.md](./README.md) - features and setup instructions
- **Next.js**: [App Router documentation](https://nextjs.org/docs/app)
- **shadcn/ui**: [Component documentation](https://ui.shadcn.com/docs/components)
- **next-intl**: [Internationalization guide](https://next-intl-docs.vercel.app/)

---

## 🎯 Quick Start Summary

1. **Development**: `npm run dev` (Turbopack) or `npm run dev:webpack` (fallback)
2. **Quality checks**: `npm run check-all` before committing
3. **New components**: `npx shadcn@latest add [component-name]`
4. **New features**: Always add translations to all 3 language files
5. **Troubleshooting**: Check this file first, then GUIDE.md for detailed help

**Key principle**: This is a mobile-first, type-safe, internationalized PWA. Every feature must work on mobile devices and support all 3 languages (EN, ZH, MS).

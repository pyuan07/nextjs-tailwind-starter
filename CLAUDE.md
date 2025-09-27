# CLAUDE.md - AI Helper Documentation

This file contains important information for AI assistants and developers working on this Next.js project.

## 🌐 Internationalization (i18n) Implementation

**IMPORTANT**: This project has a fully implemented internationalization system using `next-intl`.

### Supported Languages

The application supports **3 languages**:

- **English (en)** - Default locale
- **Chinese Simplified (zh)** - 中文简体
- **Malay (ms)** - Bahasa Melayu

### i18n Architecture

```
src/
├── i18n/
│   └── config.ts                      # Main i18n configuration with next-intl
├── messages/
│   ├── en/                           # English translations (default)
│   │   ├── common.json               # Navigation, actions, status, theme, language
│   │   ├── auth.json                 # Login, register, forgot password, logout
│   │   ├── pages.json                # Home, profile, showcase, privacy, terms, 404
│   │   └── index.ts                  # Export all translations
│   ├── zh/                           # Chinese Simplified translations
│   │   ├── common.json
│   │   ├── auth.json
│   │   ├── pages.json
│   │   └── index.ts
│   └── ms/                           # Malay translations
│       ├── common.json
│       ├── auth.json
│       ├── pages.json
│       └── index.ts
├── components/features/i18n/
│   ├── LocaleSwitcher.tsx            # Language switching component
│   └── index.ts
├── types/
│   └── i18n.ts                       # TypeScript definitions for translations
└── app/
    ├── layout.tsx                    # Root layout
    └── [locale]/                     # Locale-based routing
        ├── layout.tsx                # Locale-specific layout with NextIntlClientProvider
        ├── page.tsx                  # Homepage with translations
        └── [all other pages]         # All pages support i18n
```

### Key Implementation Details

#### 1. Middleware Integration

- `src/middleware.ts` includes i18n routing alongside existing security features
- Automatic locale detection from URL, browser preferences, or fallback
- Security features preserved (rate limiting, CSP headers, auth protection)

#### 2. Route Structure

- URLs are locale-prefixed: `/en`, `/zh`, `/ms`
- Automatic redirection to appropriate locale
- SEO-friendly with proper `hreflang` attributes

#### 3. Translation Usage in Components

```tsx
// In any component
import { useTranslations } from 'next-intl'

const t = useTranslations('common.navigation')
return <span>{t('home')}</span>

// Namespace examples:
// - common.navigation.home
// - common.actions.submit
// - auth.login.title
// - pages.home.title
```

#### 4. Type Safety

- Full TypeScript support with `src/types/i18n.ts`
- Autocompletion for all translation keys
- Type-safe namespace access

#### 5. LocaleSwitcher Component

```tsx
// Usage examples:
<LocaleSwitcher variant="dropdown" size="sm" />
<LocaleSwitcher variant="select" showLabel />
<LocaleSwitcher variant="buttons" />
```

### Translation Structure

Each locale has consistent JSON structure:

**common.json**: Navigation, actions, status messages, theme, language switcher
**auth.json**: Login, register, forgot password, logout flows
**pages.json**: Home, profile, showcase, privacy, terms, 404 pages

### Important Notes for AI Helpers

1. **Always use translations**: Never hardcode text strings in components
2. **Check existing keys**: Before adding new text, check if translation key exists
3. **Consistent namespacing**: Follow the established namespace pattern
4. **All three languages**: When adding new text, ensure all 3 locales are updated
5. **TypeScript**: Translation keys are type-safe, use autocompletion

### Adding New Translations

1. Add the key to all three locale files (`en/`, `zh/`, `ms/`)
2. Use appropriate namespace (common/auth/pages)
3. Update TypeScript if needed
4. Test in all locales

## 🔐 Authentication System

The project has a complete authentication system:

- **Demo credentials**: `demo@example.com` / `password`
- **Protected routes**: `/showcase`, `/profile`
- **Auth routes**: `/login`, `/register`, `/forgot-password`
- **Middleware protection**: Automatic redirects based on auth status

## 🎨 UI System

- **Component Library**: shadcn/ui with Radix UI primitives
- **Theme System**: Light/dark mode with system preference
- **Responsive Design**: Mobile-first with Tailwind CSS v4
- **State Management**: Zustand for global state

## 📁 Key Directories

- **`src/components/ui/`** - Base UI components from shadcn/ui
- **`src/components/features/`** - Feature-specific components
- **`src/hooks/`** - Custom React hooks
- **`src/stores/`** - Zustand state stores
- **`src/utils/`** - Helper functions and utilities
- **`src/types/`** - TypeScript type definitions

## 🚀 Development Workflow

### Commands

- `npm run dev` - Start development server
- `npm run build` - Production build
- `npm run typecheck` - Type checking
- `npm run lint` - ESLint with auto-fix
- `npm run test` - Run tests

### Important Files

- **`src/middleware.ts`** - Security + i18n routing
- **`src/app/[locale]/layout.tsx`** - Main app layout with providers
- **`src/i18n/config.ts`** - i18n configuration
- **`next.config.ts`** - Next.js + next-intl configuration

## 🛡️ Security Features

- **CSP Headers** - Content Security Policy
- **Rate Limiting** - API and general route protection
- **XSS Protection** - Cross-site scripting prevention
- **CSRF Protection** - Built-in Next.js protection
- **Input Validation** - Zod schema validation

## ⚠️ Important Reminders

1. **i18n First**: Always consider internationalization when adding new features
2. **Three Languages**: Support English, Chinese, and Malay in all new content
3. **Type Safety**: Use TypeScript throughout, especially for i18n keys
4. **Security**: Respect existing middleware and security patterns
5. **Performance**: Use Next.js 15 best practices with Turbopack

## 🚫 CRITICAL: NO HACKS OR POOR PRACTICES

**ALWAYS push for proper solutions and industry standards. NEVER accept hacks, workarounds, or poor practices.**

### ❌ Examples of What NOT to Do:

- **Context Fallbacks**: Never use try/catch to handle missing React context
- **Manual Implementations**: Don't reimplement what libraries already provide
- **Workarounds**: Avoid fixing symptoms instead of root causes
- **Anti-patterns**: Don't use escape hatches without proper justification

### ✅ Always Implement:

- **Proper Architecture**: Correct component hierarchy and provider scope
- **Industry Standards**: Follow established patterns and best practices
- **Root Cause Fixes**: Solve the actual problem, not just the symptoms
- **Clean Code**: Maintainable, readable, and performant solutions

### 🎯 When Encountering Issues:

1. **Identify Root Cause**: What is the actual architectural problem?
2. **Research Standards**: What's the industry-standard solution?
3. **Implement Properly**: Fix the architecture, not just the error
4. **Validate**: Ensure the solution follows best practices

**Example from i18n implementation:**

- ❌ BAD: `try { useTranslations() } catch { fallback }`
- ✅ GOOD: Move components inside proper provider scope

**Remember: Quality code is maintainable code. Hacks create technical debt.**

## 📝 Code Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Configured with Next.js best practices
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks for quality assurance

---

## 🤖 **MANDATORY FOR AI HELPERS**

**This project prioritizes type safety, internationalization, and user experience. Always consider these aspects when implementing new features or making changes.**

### 🚨 **ZERO TOLERANCE FOR POOR PRACTICES**

**AI Helpers MUST:**

1. **Challenge hack solutions** - If asked to implement a workaround, propose the proper solution instead
2. **Educate on best practices** - Explain why proper architecture matters
3. **Refuse poor practices** - Don't implement hacks even if requested
4. **Research industry standards** - Always check what the community recommends
5. **Prioritize maintainability** - Code quality over quick fixes

### 📋 **Quality Checklist for Every Solution:**

- [ ] Is this the industry-standard approach?
- [ ] Does this follow React/Next.js best practices?
- [ ] Is the architecture clean and maintainable?
- [ ] Are we fixing the root cause or just symptoms?
- [ ] Will this solution scale and be maintainable?

**Remember: Good developers appreciate being guided toward better solutions. Your role is to elevate code quality, not just make things work.**

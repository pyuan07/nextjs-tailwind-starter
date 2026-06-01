# Next.js 15 Starter

Production-grade Next.js 15 starter with App Router, TypeScript strict mode, Tailwind CSS v4, shadcn/ui, Zustand, next-intl (EN/ZH/MS), and httpOnly cookie auth.

## Quick Start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Demo login: `demo@example.com` / `password`

## Stack

- **Next.js 15** + React 19 (App Router, Turbopack)
- **TypeScript** strict mode
- **Tailwind CSS v4** + shadcn/ui (Radix UI)
- **Zustand** — state management
- **next-intl** — EN / ZH / MS
- **Zod** + react-hook-form — form validation
- **Vitest** + Testing Library — unit tests
- **PWA Support** — offline-ready capabilities via `@ducanh2912/next-pwa`
- **Docker Production Setup** — optimized multi-stage `Dockerfile` with standalone outputs

## Project Structure

```
src/
├── app/
│   ├── [locale]/          # All user-facing pages (i18n-aware)
│   │   ├── (auth)/        # Login, register, forgot-password pages
│   │   └── (protected)/   # Pages requiring authentication
│   └── api/               # Next.js Route Handlers
├── components/
│   ├── ui/                # shadcn/ui base components
│   └── features/          # Domain-specific components (auth, common, …)
├── constants/             # App-wide constants and route config
├── hooks/                 # Custom React hooks (useAuth, useAuthStatus, …)
├── lib/                   # Core utilities (api client, logger, validations)
├── services/              # Data-access layer (authService, userService)
├── stores/                # Zustand stores (auth-store)
├── types/                 # Shared TypeScript types (api.ts)
├── utils/                 # Pure helpers (security, cookie-manager, …)
└── middleware.ts          # Rate limiting, security headers, i18n routing
```

## How to Extend

### Add a new page

1. Create `src/app/[locale]/your-page/page.tsx`
2. Add translations to all 3 message files under a new namespace:
   - `messages/en.json`, `messages/zh.json`, `messages/ms.json`
3. To protect the route, add it to `ROUTES.PROTECTED` in `src/constants/config.ts`

### Add a new API route

1. Create `src/app/api/your-resource/route.ts`
2. Follow the pattern in `src/app/api/auth/session/route.ts`
3. Always return `ServiceResponse<T>` from `src/types/api.ts`

### Add a new service

1. Create `src/services/your.service.ts` — follow `src/services/auth.service.ts` as the recommended pattern
2. Export it from `src/services/index.ts`
3. Toggle mock vs. real backend with the `NEXT_PUBLIC_USE_REAL_API` environment variable:
   - Client-side services: `NEXT_PUBLIC_USE_REAL_API=true` in `.env.local`
   - API route handlers: use the `USE_REAL_API` server-only constant (no `NEXT_PUBLIC_` prefix)

### Add a new Zustand store

1. Create `src/stores/your-store.ts` — follow the pattern in `src/stores/auth-store.ts`
2. Export a hook from `src/hooks/use-your-store.ts`
3. Use `useShallow` from `zustand/shallow` to prevent unnecessary re-renders

### Add translations

1. Add keys to `messages/en.json`, `messages/zh.json`, `messages/ms.json`
2. Client components: `const t = useTranslations('your.namespace')`
3. Server components: `const t = await getTranslations('your.namespace')`

### Add a form

1. Define a Zod schema in `src/lib/validations/your-schema.ts`
2. Use `useForm` + `zodResolver` + shadcn `Form` components
3. See `src/components/features/auth/LoginForm.tsx` as reference

## Auth Flow

- Login / logout / session are managed via httpOnly cookies through `/api/auth/*` routes
- Access auth state with the `useAuth()` hook (`src/hooks/use-auth.ts`)
- Protect routes by adding them to `ROUTES.PROTECTED` in `src/constants/config.ts`
- `AuthGuard` in `src/components/features/auth/AuthGuard.tsx` handles client-side redirects

## Commands

```bash
npm run dev          # Development server (Turbopack)
npm run build        # Production build
npm run typecheck    # TypeScript check
npm run lint         # Lint + auto-fix
npm run test         # Run unit tests
npm run check-all    # typecheck + lint
```

### Docker Support

```bash
# Build production Docker container
docker build -t nextjs-tailwind-starter .

# Run production Docker container locally
docker run -p 3000:3000 --env NODE_ENV=production nextjs-tailwind-starter
```

## Environment Variables

Key variables (see `.env.example` for the full list):

| Variable                   | Default                 | Description                                                                          |
| -------------------------- | ----------------------- | ------------------------------------------------------------------------------------ |
| `USE_REAL_API`             | `false`                 | Server-side: `true` to use real backend in `/api/auth/*` routes                      |
| `NEXT_PUBLIC_USE_REAL_API` | `false`                 | Client-side: `true` to use real backend in `auth.service.ts` — **set both together** |
| `NEXT_PUBLIC_API_BASE_URL` | `http://localhost:3001` | Backend API URL                                                                      |
| `AUTH_TOKEN_KEY`           | `auth_token`            | Cookie name for the session token                                                    |
| `NEXT_PUBLIC_APP_URL`      | `http://localhost:3000` | Canonical app URL                                                                    |

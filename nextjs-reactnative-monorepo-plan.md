# Task: Convert Next.js Website into Monorepo with React Native App

## Current Setup

- I have a **Next.js (React) website** project.
- All code is currently inside a single Next.js app folder.

## Goal

- Restructure the project into a **Monorepo** using **Turborepo (or Nx)**.
- Add a new **React Native app (Expo preferred)** for Android + iOS.
- Share logic between web and mobile.

## Requirements

### 1. Monorepo Structure

Restructure into this folder layout:

```
apps/
  web/        (Next.js project, existing website moved here)
  mobile/     (React Native project with Expo)
packages/
  shared/     (shared logic between web + mobile)
```

### 2. Move Shared Code

Move all reusable code into `packages/shared`, including:

- API calls / API client
- Services (e.g., auth, user, cart, product)
- Constants (e.g., config values, API URLs, enums)
- Types / interfaces (if using TypeScript)
- Utility functions (e.g., date/time formatting, validators)
- Custom hooks (business logic, not UI-specific)

### 3. Integration

- Ensure both `apps/web` and `apps/mobile` can import from `packages/shared`.
- Use TypeScript path aliases for clean imports.
- Update ESLint/Prettier/TS configs to work across monorepo.

### 4. React Native App

- Initialize an Expo app inside `apps/mobile`.
- Add basic navigation (React Navigation).
- Create a simple screen that imports a shared function or constant from `packages/shared` to confirm code sharing works.

### 5. Scripts

- Add root-level scripts in `package.json`:
  - `dev:web` → run Next.js dev server
  - `dev:mobile` → run Expo dev client
  - `dev` → run both in parallel (optional, with Turborepo)

## Deliverables

- Updated **project structure** as monorepo
- Working **Next.js app** in `apps/web`
- Working **React Native (Expo) app** in `apps/mobile`
- Working **shared package** in `packages/shared`
- Example usage of shared code in both apps

import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      // Only exclude truly untestable or generated files.
      // NOTE: 80% threshold is aspirational — current coverage is lower.
      // Raise the thresholds incrementally as more tests are added.
      exclude: [
        'node_modules/**',
        '.next/**',
        'src/**/*.d.ts',
        'src/**/*.config.*',
        'src/app/layout.tsx', // root layout - hard to unit test
        'src/app/globals.css',
        'src/components/ui/**', // shadcn/ui generated components
        'src/types/**', // type definitions only
        'src/i18n/routing.ts', // config only
        'src/test/**',
      ],
    },
  },
})

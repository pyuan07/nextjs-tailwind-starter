// Test setup configuration
import '@testing-library/jest-dom'

// Mock environment variables for tests
Object.defineProperty(process.env, 'NODE_ENV', {
  value: 'test',
  writable: true,
})
Object.defineProperty(process.env, 'NEXT_PUBLIC_API_BASE_URL', {
  value: 'https://api.test.com',
  writable: true,
})
Object.defineProperty(process.env, 'NEXT_PUBLIC_APP_NAME', {
  value: 'Test App',
  writable: true,
})

// Mock Next.js router
const mockPush = jest.fn()
const mockReplace = jest.fn()
const mockBack = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    back: mockBack,
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock Next.js dynamic imports
jest.mock('next/dynamic', () => {
  return function mockDynamic(fn: any) {
    const Component = fn()
    return Component
  }
})

// Window.location is now properly handled by jsdom in Jest 30+

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock fetch
global.fetch = jest.fn()

// Clean up after each test
beforeEach(() => {
  jest.clearAllMocks()
  localStorageMock.clear()
})

export { mockPush, mockReplace, mockBack, localStorageMock }

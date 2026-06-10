import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import withBundleAnalyzerInit from '@next/bundle-analyzer'
import withPWAInit from '@ducanh2912/next-pwa'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const withBundleAnalyzer = withBundleAnalyzerInit({
  enabled: process.env.ANALYZE === 'true',
})

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  reloadOnOnline: true,
  cacheOnFrontEndNav: true,
  workboxOptions: {
    runtimeCaching: [
      // Google Fonts runtime caching removed: fonts are now self-hosted via next/font
      // and served from same-origin /_next/static, so no cross-origin font requests occur.
      {
        urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'static-font-assets',
          expiration: {
            maxEntries: 4,
            maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
          },
        },
      },
      {
        urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'static-image-assets',
          expiration: {
            maxEntries: 64,
            maxAgeSeconds: 24 * 60 * 60, // 24 hours
          },
        },
      },
      {
        urlPattern: /\/_next\/image\?url=.+$/i,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'next-image',
          expiration: {
            maxEntries: 64,
            maxAgeSeconds: 24 * 60 * 60, // 24 hours
          },
        },
      },
      {
        urlPattern: /\.(?:mp3|wav|ogg)$/i,
        handler: 'CacheFirst',
        options: {
          rangeRequests: true,
          cacheName: 'static-audio-assets',
          expiration: {
            maxEntries: 32,
            maxAgeSeconds: 24 * 60 * 60, // 24 hours
          },
        },
      },
      {
        urlPattern: /\.(?:mp4)$/i,
        handler: 'CacheFirst',
        options: {
          rangeRequests: true,
          cacheName: 'static-video-assets',
          expiration: {
            maxEntries: 32,
            maxAgeSeconds: 24 * 60 * 60, // 24 hours
          },
        },
      },
      {
        urlPattern: /\.(?:js)$/i,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'static-js-assets',
          expiration: {
            maxEntries: 48,
            maxAgeSeconds: 24 * 60 * 60, // 24 hours
          },
        },
      },
      {
        urlPattern: /\.(?:css|less)$/i,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'static-style-assets',
          expiration: {
            maxEntries: 32,
            maxAgeSeconds: 24 * 60 * 60, // 24 hours
          },
        },
      },
      {
        urlPattern: /\/_next\/data\/.+\/.+\.json$/i,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'next-data',
          expiration: {
            maxEntries: 32,
            maxAgeSeconds: 24 * 60 * 60, // 24 hours
          },
        },
      },
      {
        urlPattern: /\.(?:json|xml|csv)$/i,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'static-data-assets',
          expiration: {
            maxEntries: 32,
            maxAgeSeconds: 24 * 60 * 60, // 24 hours
          },
        },
      },
      {
        urlPattern: ({ url }: { url: URL }) => {
          const isSameOrigin = self.origin === url.origin
          if (!isSameOrigin) return false
          const pathname = url.pathname
          // Exclude /api/auth and similar
          if (pathname.startsWith('/api/auth/')) return false
          if (pathname.startsWith('/api/')) return true
          return false
        },
        handler: 'NetworkFirst',
        method: 'GET',
        options: {
          cacheName: 'apis',
          expiration: {
            maxEntries: 16,
            maxAgeSeconds: 24 * 60 * 60, // 24 hours
          },
          networkTimeoutSeconds: 10, // fall back to cache if api does not response within 10 seconds
        },
      },
      {
        urlPattern: ({ url }: { url: URL }) => {
          const isSameOrigin = self.origin === url.origin
          const pathname = url.pathname
          // Exclude /api/
          if (pathname.startsWith('/api/')) return false
          return isSameOrigin
        },
        handler: 'NetworkFirst',
        options: {
          cacheName: 'others',
          expiration: {
            maxEntries: 32,
            maxAgeSeconds: 24 * 60 * 60, // 24 hours
          },
          networkTimeoutSeconds: 10,
        },
      },
      {
        urlPattern: ({ url }: { url: URL }) => {
          const isSameOrigin = self.origin === url.origin
          return !isSameOrigin
        },
        handler: 'NetworkFirst',
        options: {
          cacheName: 'cross-origin',
          expiration: {
            maxEntries: 32,
            maxAgeSeconds: 60 * 60, // 1 hour
          },
          networkTimeoutSeconds: 10,
        },
      },
    ],
  },
})

const nextConfig: NextConfig = {
  // Standalone output for highly optimized production Docker builds
  output: 'standalone',

  // Performance optimizations
  experimental: {
    // Only node_modules packages are valid here — local @/ paths are not supported
    optimizePackageImports: ['lucide-react', 'zustand'],
  },

  // Turbopack configuration
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Compression
  compress: true,

  // Security headers
  poweredByHeader: false,

  // Bundle optimization (only for webpack builds, not turbopack)
  ...(!process.env.TURBOPACK && {
    webpack: (config, { isServer }) => {
      // Add bundle analysis
      if (process.env.BUNDLE_ANALYZE) {
        // Dynamic require needed because this ESM config file wraps a CJS plugin
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'server',
            analyzerPort: isServer ? 8888 : 8889,
            openAnalyzer: true,
          })
        )
      }

      // Enable tree shaking of unused exports without overriding per-package
      // sideEffects fields (which would incorrectly drop CSS from node_modules)
      config.optimization = {
        ...config.optimization,
        usedExports: true,
      }

      return config
    },
  }),
}

// Export configuration with next-intl, PWA, and bundle analyzer
export default withNextIntl(withPWA(withBundleAnalyzer(nextConfig)))

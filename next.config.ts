import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const withNextIntl = createNextIntlPlugin('./src/i18n/config.ts')

const nextConfig: NextConfig = {
  // Performance optimizations
  experimental: {
    optimizePackageImports: [
      '@/components',
      '@/utils',
      '@/hooks',
      'lucide-react',
      'zustand',
    ],
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
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'server',
            analyzerPort: isServer ? 8888 : 8889,
            openAnalyzer: true,
          })
        )
      }

      // Tree shaking improvements (compatible with Next.js caching)
      config.optimization = {
        ...config.optimization,
        sideEffects: false,
      }

      return config
    },
  }),
}

export default withNextIntl(withBundleAnalyzer(nextConfig))

import { MetadataRoute } from 'next'
import { env } from '@/config/env'

type SitemapLocale = 'en' | 'zh' | 'ms'

const locales: SitemapLocale[] = ['en', 'zh', 'ms']

interface RouteConfig {
  path: string
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
  priority: number
}

/**
 * Dynamic sitemap generation for Next.js 15
 * Emits locale-prefixed URLs with hreflang alternates to avoid 308 redirects
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = env.isDevelopment
    ? 'http://localhost:3000'
    : process.env.NEXT_PUBLIC_APP_URL || 'https://example.com'

  const now = new Date()

  // Route configurations (paths relative to locale prefix)
  const routes: RouteConfig[] = [
    { path: '', changeFrequency: 'daily', priority: 1.0 },
    { path: '/login', changeFrequency: 'monthly', priority: 0.3 },
    { path: '/register', changeFrequency: 'monthly', priority: 0.3 },
    { path: '/forgot-password', changeFrequency: 'monthly', priority: 0.2 },
    { path: '/showcase', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/profile', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/privacy', changeFrequency: 'yearly', priority: 0.4 },
    { path: '/terms', changeFrequency: 'yearly', priority: 0.4 },
  ]

  const entries: MetadataRoute.Sitemap = []

  for (const locale of locales) {
    for (const route of routes) {
      const localeUrl = `${baseUrl}/${locale}${route.path}`
      const alternateLanguages: Record<string, string> = {}
      for (const altLocale of locales) {
        alternateLanguages[altLocale] = `${baseUrl}/${altLocale}${route.path}`
      }

      entries.push({
        url: localeUrl,
        lastModified: now,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: {
          languages: alternateLanguages,
        },
      })
    }
  }

  return entries
}

/**
 * Helper functions for dynamic content (to be implemented)
 */

// Example: Get blog posts from your CMS/Database
// async function getBlogPosts() {
//   try {
//     // Replace with your actual data fetching logic
//     // const posts = await db.blogPost.findMany({
//     //   where: { published: true },
//     //   select: { slug: true, updatedAt: true },
//     // })
//     // return posts
//     return []
//   } catch (error) {
//     console.error('Error fetching blog posts for sitemap:', error)
//     return []
//   }
// }

// Example: Get products from your database
// async function getProducts() {
//   try {
//     // Replace with your actual data fetching logic
//     // const products = await db.product.findMany({
//     //   where: { active: true },
//     //   select: { slug: true, updatedAt: true },
//     // })
//     // return products
//     return []
//   } catch (error) {
//     console.error('Error fetching products for sitemap:', error)
//     return []
//   }
// }

// Example: Get categories from your database
// async function getCategories() {
//   try {
//     // Replace with your actual data fetching logic
//     // const categories = await db.category.findMany({
//     //   select: { slug: true, updatedAt: true },
//     // })
//     // return categories
//     return []
//   } catch (error) {
//     console.error('Error fetching categories for sitemap:', error)
//     return []
//   }
// }

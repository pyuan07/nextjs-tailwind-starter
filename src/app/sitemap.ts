import { MetadataRoute } from 'next'
import { env } from '@/config/env'

/**
 * Dynamic sitemap generation for Next.js 15
 * Automatically includes all static routes and can be extended with dynamic content
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = env.isDevelopment
    ? 'http://localhost:3000'
    : process.env.NEXT_PUBLIC_APP_URL || 'https://example.com'

  const now = new Date()
  const lastModified = now.toISOString()

  // Static routes configuration
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/login`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/register`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/forgot-password`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.2,
    },
    {
      url: `${baseUrl}/showcase`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/profile`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
  ]

  // TODO: Add dynamic routes here
  // Example: Blog posts, products, user profiles, etc.
  /*
  const dynamicRoutes = await Promise.all([
    getBlogPosts(),
    getProducts(),
    getCategories(),
  ]).then(([posts, products, categories]) => {
    const blogRoutes = posts.map(post => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    const productRoutes = products.map(product => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }))

    const categoryRoutes = categories.map(category => ({
      url: `${baseUrl}/category/${category.slug}`,
      lastModified: category.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

    return [...blogRoutes, ...productRoutes, ...categoryRoutes]
  })
  */

  return [
    ...staticRoutes,
    // ...dynamicRoutes,
  ]
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

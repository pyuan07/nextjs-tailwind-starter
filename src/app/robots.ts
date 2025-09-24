import { MetadataRoute } from 'next'
import { env } from '@/config/env'

/**
 * Dynamic robots.txt generation for Next.js 15
 * Configures search engine crawling rules based on environment
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = env.isDevelopment
    ? 'http://localhost:3000'
    : process.env.NEXT_PUBLIC_APP_URL || 'https://example.com'

  // Production robots.txt - Allow crawling
  if (env.isProduction) {
    return {
      rules: [
        {
          userAgent: '*',
          allow: '/',
          disallow: [
            '/api/',
            '/admin/',
            '/_next/',
            '/private/',
            '/dashboard/',
            '/profile/',
            '/login',
            '/register',
            '/forgot-password',
            '/reset-password',
            '/verify-email',
            '/auth/',
            '/*.json$',
            '/*?*', // Query parameters
            '/search', // Search pages can create duplicate content
          ],
        },
        {
          userAgent: 'GPTBot',
          disallow: '/',
        },
        {
          userAgent: 'ChatGPT-User',
          disallow: '/',
        },
        {
          userAgent: 'CCBot',
          disallow: '/',
        },
        {
          userAgent: 'anthropic-ai',
          disallow: '/',
        },
        {
          userAgent: 'Claude-Web',
          disallow: '/',
        },
      ],
      sitemap: `${baseUrl}/sitemap.xml`,
      host: baseUrl,
    }
  }

  // Development/Staging robots.txt - Block all crawling
  return {
    rules: {
      userAgent: '*',
      disallow: '/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

/**
 * Additional SEO considerations for robots.txt:
 *
 * 1. Crawl Delay: Add crawl-delay if your server needs throttling
 *    crawlDelay: 1, // 1 second delay between requests
 *
 * 2. Specific Bot Rules: Add rules for specific search engines
 *    {
 *      userAgent: 'Googlebot',
 *      allow: '/',
 *      disallow: ['/admin/', '/private/'],
 *      crawlDelay: 1,
 *    }
 *
 * 3. Image Crawling: Allow or disallow image indexing
 *    {
 *      userAgent: 'Googlebot-Image',
 *      allow: '/images/',
 *      disallow: '/private-images/',
 *    }
 *
 * 4. News Crawling: For news sites
 *    {
 *      userAgent: 'Googlebot-News',
 *      allow: '/news/',
 *    }
 *
 * 5. Social Media Bots: Allow social media crawlers
 *    {
 *      userAgent: 'facebookexternalhit',
 *      allow: '/',
 *    }
 *
 * 6. Block Bad Bots: Block known malicious crawlers
 *    {
 *      userAgent: ['BadBot', 'MaliciousCrawler'],
 *      disallow: '/',
 *    }
 */

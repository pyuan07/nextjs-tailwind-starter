/**
 * Comprehensive SEO utilities for Next.js 15 with App Router
 * Provides dynamic metadata generation, structured data, and social media optimization
 */

import React from 'react'
import { Metadata, Viewport } from 'next'
import { env } from '@/config/env'

export interface SEOConfig {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'profile'
  locale?: string
  siteName?: string
  author?: string
  publishedTime?: string
  modifiedTime?: string
  section?: string
  tags?: string[]
  noIndex?: boolean
  noFollow?: boolean
  canonical?: string
}

export interface StructuredDataConfig {
  type:
    | 'WebSite'
    | 'Organization'
    | 'Article'
    | 'Product'
    | 'Person'
    | 'BreadcrumbList'
    | 'FAQPage'
  data: Record<string, unknown>
}

/**
 * Default SEO configuration
 */
export const DEFAULT_SEO: Required<
  Pick<SEOConfig, 'siteName' | 'locale' | 'type'>
> &
  SEOConfig = {
  siteName: env.APP_NAME,
  locale: 'en_US',
  type: 'website',
  title: 'React Tailwind Starter - Modern Next.js Boilerplate',
  description:
    'A production-ready Next.js starter with TypeScript, Tailwind CSS, and modern best practices for building fast, secure web applications.',
  keywords: [
    'Next.js',
    'React',
    'TypeScript',
    'Tailwind CSS',
    'Modern Web Development',
    'Boilerplate',
    'Starter Template',
    'Full Stack',
  ],
  image: '/images/og-default.jpg',
  author: 'Your Name',
}

/**
 * Generate comprehensive metadata for Next.js App Router
 */
export function generateMetadata(config: SEOConfig = {}): Metadata {
  const seo = { ...DEFAULT_SEO, ...config }
  const baseUrl = env.isDevelopment
    ? 'http://localhost:3000'
    : process.env.NEXT_PUBLIC_APP_URL || 'https://example.com'

  const title = seo.title
  const description = seo.description || DEFAULT_SEO.description!
  const image = seo.image?.startsWith('http')
    ? seo.image
    : `${baseUrl}${seo.image || DEFAULT_SEO.image}`
  const url = seo.url
    ? seo.url.startsWith('http')
      ? seo.url
      : `${baseUrl}${seo.url}`
    : baseUrl
  const canonical = seo.canonical
    ? seo.canonical.startsWith('http')
      ? seo.canonical
      : `${baseUrl}${seo.canonical}`
    : url

  const metadata: Metadata = {
    // Basic metadata
    title,
    description,
    keywords: seo.keywords,
    authors: seo.author ? [{ name: seo.author }] : undefined,
    creator: seo.author,
    publisher: seo.siteName,

    // Canonical URL
    alternates: {
      canonical,
    },

    // Robots
    robots: {
      index: !seo.noIndex,
      follow: !seo.noFollow,
      googleBot: {
        index: !seo.noIndex,
        follow: !seo.noFollow,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Open Graph
    openGraph: {
      type: seo.type,
      locale: seo.locale,
      url,
      title,
      description,
      siteName: seo.siteName,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(seo.type === 'article' && {
        publishedTime: seo.publishedTime,
        modifiedTime: seo.modifiedTime,
        section: seo.section,
        authors: seo.author ? [seo.author] : undefined,
        tags: seo.tags,
      }),
    },

    // Twitter
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: seo.author
        ? `@${seo.author.replace(/\s+/g, '').toLowerCase()}`
        : undefined,
      site: `@${seo.siteName?.replace(/\s+/g, '').toLowerCase()}`,
    },

    // Icons and app metadata
    icons: {
      icon: [
        { url: '/favicon.ico' },
        { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
      apple: '/apple-touch-icon.png',
    },

    // Manifest
    manifest: '/manifest.json',

    // App-specific metadata
    applicationName: seo.siteName,
    referrer: 'origin-when-cross-origin',

    // Category
    category: 'technology',
  }

  return metadata
}

/**
 * Generate viewport configuration for Next.js 15+
 * Extracted from metadata to comply with new API requirements
 */
export function generateViewport(): Viewport {
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    colorScheme: 'dark light',
    themeColor: [
      { media: '(prefers-color-scheme: light)', color: '#ffffff' },
      { media: '(prefers-color-scheme: dark)', color: '#000000' },
    ],
  }
}

/**
 * Generate JSON-LD structured data
 */
export function generateStructuredData(
  configs: StructuredDataConfig[]
): string {
  const structuredData = configs.map(config => {
    const baseData = {
      '@context': 'https://schema.org',
      '@type': config.type,
      ...config.data,
    }

    return baseData
  })

  return JSON.stringify(
    structuredData.length === 1 ? structuredData[0] : structuredData
  )
}

/**
 * Common structured data generators
 */
export const structuredDataGenerators = {
  /**
   * Website structured data
   */
  website: (config: {
    name: string
    url: string
    description?: string
  }): StructuredDataConfig => ({
    type: 'WebSite',
    data: {
      name: config.name,
      url: config.url,
      description: config.description,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${config.url}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  }),

  /**
   * Organization structured data
   */
  organization: (config: {
    name: string
    url: string
    logo?: string
    description?: string
    contactPoint?: {
      telephone?: string
      contactType?: string
      email?: string
    }
    sameAs?: string[]
  }): StructuredDataConfig => ({
    type: 'Organization',
    data: {
      name: config.name,
      url: config.url,
      logo: config.logo,
      description: config.description,
      contactPoint: config.contactPoint
        ? {
            '@type': 'ContactPoint',
            ...config.contactPoint,
          }
        : undefined,
      sameAs: config.sameAs,
    },
  }),

  /**
   * Article structured data
   */
  article: (config: {
    headline: string
    description: string
    image: string
    datePublished: string
    dateModified?: string
    author: {
      name: string
      url?: string
    }
    publisher: {
      name: string
      logo: string
    }
    url: string
  }): StructuredDataConfig => ({
    type: 'Article',
    data: {
      headline: config.headline,
      description: config.description,
      image: config.image,
      datePublished: config.datePublished,
      dateModified: config.dateModified || config.datePublished,
      author: {
        '@type': 'Person',
        name: config.author.name,
        url: config.author.url,
      },
      publisher: {
        '@type': 'Organization',
        name: config.publisher.name,
        logo: {
          '@type': 'ImageObject',
          url: config.publisher.logo,
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': config.url,
      },
    },
  }),

  /**
   * Breadcrumb structured data
   */
  breadcrumb: (
    items: { name: string; url: string }[]
  ): StructuredDataConfig => ({
    type: 'BreadcrumbList',
    data: {
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    },
  }),

  /**
   * FAQ structured data
   */
  faq: (
    faqs: { question: string; answer: string }[]
  ): StructuredDataConfig => ({
    type: 'FAQPage',
    data: {
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    },
  }),
}

/**
 * SEO utilities
 */
export const seoUtils = {
  /**
   * Generate page title with site name
   */
  generateTitle: (pageTitle?: string, siteName?: string): string => {
    const site = siteName || DEFAULT_SEO.siteName!
    if (!pageTitle) return site
    return `${pageTitle} | ${site}`
  },

  /**
   * Truncate description to optimal length
   */
  truncateDescription: (
    description: string,
    maxLength: number = 160
  ): string => {
    if (description.length <= maxLength) return description
    return description.substring(0, maxLength - 3).trim() + '...'
  },

  /**
   * Generate keywords from content
   */
  generateKeywords: (
    content: string,
    baseKeywords: string[] = []
  ): string[] => {
    const words = content
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3)
      .filter((word, index, array) => array.indexOf(word) === index)
      .slice(0, 10)

    return [...baseKeywords, ...words]
  },

  /**
   * Validate URL for social media
   */
  validateImageUrl: (url: string, baseUrl?: string): string => {
    if (!url) return DEFAULT_SEO.image!
    if (url.startsWith('http')) return url
    const base =
      baseUrl ||
      (env.isDevelopment
        ? 'http://localhost:3000'
        : process.env.NEXT_PUBLIC_APP_URL || 'https://example.com')
    return `${base}${url.startsWith('/') ? url : `/${url}`}`
  },

  /**
   * Generate social media share URLs
   */
  generateShareUrls: (config: {
    url: string
    title: string
    description?: string
  }) => ({
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(config.url)}&text=${encodeURIComponent(config.title)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(config.url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(config.url)}`,
    reddit: `https://reddit.com/submit?url=${encodeURIComponent(config.url)}&title=${encodeURIComponent(config.title)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${config.title} ${config.url}`)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(config.url)}&text=${encodeURIComponent(config.title)}`,
  }),
}

/**
 * React component for structured data
 */
export function StructuredData({ data }: { data: StructuredDataConfig[] }) {
  const jsonLd = generateStructuredData(data)

  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: jsonLd }}
    />
  )
}

import { SITE_URL } from '@/lib/site'

/** Served at /robots.txt. */
export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Checkout and webhook endpoints have nothing to index.
        disallow: ['/api/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}

/**
 * Canonical origin for the site. Metadata, sitemap, JSON-LD and the Midtrans
 * callbacks all resolve against this, so it must be a fully-qualified URL
 * without a trailing slash.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://jeepsunrisebali.com'
).replace(/\/$/, '')

/** Join a root-relative path onto SITE_URL. */
export const absoluteUrl = (path = '/') =>
  `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`

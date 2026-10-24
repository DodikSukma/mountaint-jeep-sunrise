import { routing, localeMeta } from '@/i18n/routing'
import { SITE_URL } from '@/lib/site'

/**
 * XML sitemap covering every language route, each carrying the full hreflang
 * alternate cluster so crawlers see the three pages as translations rather
 * than duplicates. Served at /sitemap.xml.
 */
export default function sitemap() {
  const lastModified = new Date()

  const languages = Object.fromEntries(
    routing.locales.map((l) => [localeMeta[l].htmlLang, `${SITE_URL}/${l}`])
  )

  return routing.locales.map((locale) => ({
    url: `${SITE_URL}/${locale}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: locale === routing.defaultLocale ? 1 : 0.8,
    alternates: { languages },
  }))
}

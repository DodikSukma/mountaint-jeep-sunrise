import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'

const SITE_URL = 'https://batursunrisetrekking.com' // replace with the real domain on deploy
const OG_IMAGE =
  'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=1200&q=80'

export default function SEOHead() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.startsWith('id') ? 'id' : 'en'

  const title = t('seo.title')
  const description = t('seo.description')
  const keywords = t('seo.keywords')
  const ogTitle = t('seo.og_title')
  const ogDescription = t('seo.og_description')

  return (
    <Helmet>
      <html lang={lang} />
      <title>{title}</title>

      {/* Primary meta */}
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Batur Sunrise Trekking" />
      <meta name="robots" content="index, follow" />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={SITE_URL} />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:image" content={OG_IMAGE} />
      <meta property="og:locale" content={lang === 'id' ? 'id_ID' : 'en_US'} />
      <meta property="og:site_name" content="Batur Sunrise Trekking" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle} />
      <meta name="twitter:description" content={ogDescription} />
      <meta name="twitter:image" content={OG_IMAGE} />

      {/* Canonical & alternate */}
      <link rel="canonical" href={SITE_URL} />
      <link rel="alternate" hrefLang="en" href={`${SITE_URL}?lng=en`} />
      <link rel="alternate" hrefLang="id" href={`${SITE_URL}?lng=id`} />

      {/* Structured data */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'TouristAttraction',
          name: 'Batur Sunrise Trekking',
          description,
          url: SITE_URL,
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Yudistira Street',
            addressLocality: 'Bayunggede, Kintamani',
            addressRegion: 'Bangli, Bali',
            addressCountry: 'ID',
          },
          telephone: '+6281228601710',
          geo: {
            '@type': 'GeoCoordinates',
            latitude: -8.2940321,
            longitude: 115.339859,
          },
        })}
      </script>
    </Helmet>
  )
}

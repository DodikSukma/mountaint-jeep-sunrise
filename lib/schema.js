import { location } from '@/data/location'
import { localeMeta } from '@/i18n/routing'
import { absoluteUrl } from './site'

// Kept in sync with the Google Business Profile listing (see data/location.js).
const GEO = {
  latitude: location.coordinates.lat,
  longitude: location.coordinates.lng,
}

const POSTAL_ADDRESS = {
  '@type': 'PostalAddress',
  streetAddress: 'Bayung Gede',
  addressLocality: 'Kintamani',
  addressRegion: 'Bangli, Bali',
  postalCode: '80652',
  addressCountry: 'ID',
}

/**
 * Build the JSON-LD @graph for a locale.
 *
 * Emits four linked node types so search engines can tell the business, the
 * place, the site and the sellable tours apart:
 *   TravelAgency      — the operator (NAP data, socials)
 *   TouristAttraction — Mount Batur itself
 *   WebSite           — the localized site node
 *   Product + Offer   — one per tour package, priced in IDR
 *
 * @param {object}   args
 * @param {string}   args.locale       - 'en' | 'id' | 'zh'
 * @param {object}   args.seo          - { title, description }
 * @param {string}   args.tagline      - short business description
 * @param {object[]} args.tourPackages - [{ id, name, description, price }]
 */
export function buildJsonLd({ locale, seo, tagline, tourPackages }) {
  const inLanguage = localeMeta[locale].htmlLang
  const pageUrl = absoluteUrl(`/${locale}`)
  const orgId = absoluteUrl('/#organization')
  const attractionId = absoluteUrl('/#attraction')

  const organization = {
    '@type': 'TravelAgency',
    '@id': orgId,
    name: location.businessName,
    description: tagline,
    url: pageUrl,
    logo: absoluteUrl('/logo/HdLogoMJS.png'),
    image: absoluteUrl('/og.jpg'),
    telephone: `+${location.phoneRaw}`,
    email: location.email,
    address: POSTAL_ADDRESS,
    geo: { '@type': 'GeoCoordinates', ...GEO },
    hasMap: location.mapsUrl,
    priceRange: 'IDR 200.000 - IDR 900.000',
    currenciesAccepted: 'IDR',
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Kintamani, Bangli, Bali, Indonesia',
    },
    sameAs: [
      location.social.instagram,
      location.social.facebook,
      location.social.whatsapp,
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'reservations',
      telephone: `+${location.phoneRaw}`,
      email: location.email,
      availableLanguage: ['en', 'id', 'zh'],
    },
  }

  const attraction = {
    '@type': 'TouristAttraction',
    '@id': attractionId,
    name: 'Mount Batur',
    description: seo.description,
    url: pageUrl,
    image: absoluteUrl('/og.jpg'),
    address: POSTAL_ADDRESS,
    geo: { '@type': 'GeoCoordinates', ...GEO },
    isAccessibleForFree: false,
    touristType: ['Adventure travellers', 'Hikers', 'Families'],
    availableLanguage: ['en', 'id', 'zh'],
  }

  const website = {
    '@type': 'WebSite',
    '@id': absoluteUrl(`/${locale}#website`),
    url: pageUrl,
    name: seo.title,
    description: seo.description,
    inLanguage,
    publisher: { '@id': orgId },
  }

  const products = tourPackages.map((pkg) => ({
    '@type': 'Product',
    '@id': absoluteUrl(`/${locale}#${pkg.id}`),
    name: pkg.name,
    description: pkg.description,
    image: absoluteUrl(pkg.image),
    brand: { '@id': orgId },
    category: 'Tour package',
    offers: {
      '@type': 'Offer',
      url: `${pageUrl}#packages`,
      price: String(pkg.price),
      priceCurrency: 'IDR',
      availability: 'https://schema.org/InStock',
      seller: { '@id': orgId },
      // Prices are reviewed seasonally; give crawlers a bounded validity window.
      priceValidUntil: `${new Date().getUTCFullYear() + 1}-12-31`,
    },
  }))

  return {
    '@context': 'https://schema.org',
    '@graph': [organization, attraction, website, ...products],
  }
}

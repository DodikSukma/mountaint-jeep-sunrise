import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Inter, Poppins } from 'next/font/google'

import { routing, localeMeta } from '@/i18n/routing'
import { SITE_URL, absoluteUrl } from '@/lib/site'
import '../globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
})

/** Pre-render all three locales at build time. */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) return {}

  const t = await getTranslations({ locale, namespace: 'seo' })
  const meta = localeMeta[locale]

  // One canonical per language, plus a full hreflang cluster so Google serves
  // the right variant instead of treating the three as duplicates.
  const languages = Object.fromEntries(
    routing.locales.map((l) => [localeMeta[l].htmlLang, `/${l}`])
  )

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t('title'),
      template: `%s | ${t('title')}`,
    },
    description: t('description'),
    keywords: t('keywords'),
    authors: [{ name: 'Batur Jeep Sunrise and Tracking' }],
    creator: 'Batur Jeep Sunrise and Tracking',
    alternates: {
      canonical: `/${locale}`,
      languages: { ...languages, 'x-default': `/${routing.defaultLocale}` },
    },
    openGraph: {
      type: 'website',
      url: absoluteUrl(`/${locale}`),
      siteName: 'Batur Jeep Sunrise and Tracking',
      title: t('og_title'),
      description: t('og_description'),
      locale: meta.ogLocale,
      alternateLocale: routing.locales
        .filter((l) => l !== locale)
        .map((l) => localeMeta[l].ogLocale),
      images: [
        {
          url: '/og.jpg',
          width: 1200,
          height: 630,
          alt: t('og_title'),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('og_title'),
      description: t('og_description'),
      images: ['/og.jpg'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: [{ url: '/logo/HdLogoMJS.png', type: 'image/png' }],
      apple: '/logo/HdLogoMJS.png',
    },
  }
}

export const viewport = {
  themeColor: '#6D28D9',
  width: 'device-width',
  initialScale: 1,
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()

  // Opts this layout (and everything under it) into static rendering.
  setRequestLocale(locale)

  return (
    <html
      lang={localeMeta[locale].htmlLang}
      className={`${inter.variable} ${poppins.variable}`}
    >
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  )
}

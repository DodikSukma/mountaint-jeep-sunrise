import { getTranslations, setRequestLocale } from 'next-intl/server'

import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import PackageList from '@/components/PackageList'
import GalleryGrid from '@/components/GalleryGrid'
import Testimonials from '@/components/Testimonials'
import LocationSection from '@/components/LocationSection'
import Footer from '@/components/Footer'

import { packages, getUnitPrice, hasDualPricing } from '@/data/packages'
import { buildJsonLd } from '@/lib/schema'

export default async function HomePage({ params }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale })

  // Structured data is built server-side from the same dictionary the UI uses,
  // so the schema markup is localized alongside the page copy.
  const jsonLd = buildJsonLd({
    locale,
    seo: { title: t('seo.title'), description: t('seo.description') },
    tagline: t('footer.tagline'),
    tourPackages: packages.map((pkg) => ({
      id: pkg.id,
      image: pkg.image,
      name: t(`packages.${pkg.translationKey}.name`),
      description: t(`packages.${pkg.translationKey}.tagline`),
      price: getUnitPrice(pkg, hasDualPricing(pkg) ? 'sharing' : undefined),
    })),
  })

  return (
    <>
      <script
        type="application/ld+json"
        // Content is fully server-controlled (dictionary + static data), never user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main>
        <Hero />
        <About />
        <PackageList />
        <GalleryGrid />
        <Testimonials />
        <LocationSection />
      </main>
      <Footer />
    </>
  )
}

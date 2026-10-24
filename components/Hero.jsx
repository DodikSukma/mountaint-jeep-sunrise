import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { ArrowRight, MapPin, MessageCircle } from 'lucide-react'

import { buildEnquiryUrl } from '@/data/location'

export default function Hero() {
  const t = useTranslations('hero')
  const locale = useLocale()
  const whatsappUrl = buildEnquiryUrl(locale)

  return (
    <section
      id="hero"
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden"
    >
      {/* Background — the LCP element, so it loads eagerly at high priority. */}
      <Image
        src="/hero.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        quality={75}
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-brand-navy-950/80 via-brand-navy-900/60 to-brand-purple-900/70" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {/* Decorative glow */}
      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-brand-yellow-400/20 blur-3xl" />
      <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-brand-purple-500/30 blur-3xl" />

      {/* Content */}
      <div className="container-custom relative z-10 pt-28 pb-40 sm:pb-32 text-center animate-fade-up">
        {/* Badge */}
        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/25 backdrop-blur-sm px-4 py-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-white">
          <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-brand-yellow-400" />
          {t('badge')}
        </span>

        {/* Title */}
        <h1 className="mt-6 font-display font-extrabold text-white leading-[1.05] text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem]">
          {t('title_1')}
          <br />
          <span className="text-brand-yellow-400">{t('title_2')}</span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-2xl text-base md:text-lg text-white/80 leading-relaxed">
          {t('subtitle')}
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-yellow text-base px-8 py-4 w-full sm:w-auto"
          >
            <MessageCircle className="h-5 w-5" />
            {t('cta_primary')}
          </a>
          <a
            href="#packages"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border-2 border-white/40 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 hover:border-white"
          >
            {t('cta_secondary')}
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* Stats strip */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="bg-white/10 backdrop-blur-md border-t border-white/20">
          <div className="container-custom grid grid-cols-2 md:grid-cols-4 gap-4 py-5 md:py-6">
            <Stat value="1,717" label={t('stats.masl')} />
            <Stat value="4" label={t('stats.packages')} />
            <Stat value="10+" label={t('stats.experience')} />
            <Stat value="15K+" label={t('stats.travelers')} />
          </div>
        </div>
      </div>
    </section>
  )
}

function Stat({ value, label }) {
  return (
    <div className="text-center">
      <div className="font-display text-2xl md:text-3xl font-bold text-brand-yellow-400">
        {value}
      </div>
      <div className="mt-1 text-[10px] md:text-xs font-semibold uppercase tracking-[0.15em] text-white/80">
        {label}
      </div>
    </div>
  )
}

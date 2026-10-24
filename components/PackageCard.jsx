'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import {
  Check,
  Clock,
  ChevronDown,
  ChevronUp,
  Users,
  MessageCircle,
  Star,
  CreditCard,
  Mountain,
  Droplets,
  Sunrise,
  Truck,
} from 'lucide-react'

import { formatIDR, hasDualPricing } from '@/data/packages'
import { buildWhatsAppUrl } from '@/data/location'
import { IS_PAYMENT_CONFIGURED } from '@/lib/midtrans-client'
import BookingModal from './BookingModal'

// `pkg` arrives from a Server Component, so icons cross the boundary as
// strings and are resolved to components here.
const ICONS = { Mountain, Droplets, Sunrise, Truck }

export default function PackageCard({ pkg }) {
  const t = useTranslations()
  const locale = useLocale()
  const [showItinerary, setShowItinerary] = useState(false)
  const [booking, setBooking] = useState(false)

  const Icon = ICONS[pkg.iconName] ?? Mountain
  const key = pkg.translationKey
  const name = t(`packages.${key}.name`)
  const tagline = t(`packages.${key}.tagline`)
  const inclusions = t.raw(`packages.${key}.inclusions`)
  const itinerary = pkg.hasItinerary ? t.raw(`packages.${key}.itinerary`) : []

  const whatsappUrl = buildWhatsAppUrl(name, locale)

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:shadow-brand-lg hover:-translate-y-1 duration-300">
      {pkg.popular && (
        <div className="absolute top-4 right-4 z-10 inline-flex items-center gap-1 rounded-full bg-brand-yellow-400 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-navy-950 shadow-md">
          <Star className="h-3 w-3 fill-current" />
          {t('packages.popular')}
        </div>
      )}

      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <Image
          src={pkg.image}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
          quality={75}
          className="object-cover transition duration-700 group-hover:scale-110"
        />
        <div
          className={`absolute inset-0 bg-gradient-to-t ${pkg.accentClass} opacity-50`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 grid h-12 w-12 place-items-center rounded-2xl bg-white shadow-lg">
          <Icon className={`h-6 w-6 ${pkg.iconColor}`} />
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl md:text-2xl font-bold text-brand-navy-900 leading-tight">
          {name}
        </h3>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">{tagline}</p>

        {/* Meta chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          {pkg.hasFixedTime && (
            <Chip Icon={Clock}>{t(`packages.${key}.time`)}</Chip>
          )}
          {pkg.hasDuration && (
            <Chip Icon={Clock}>{t(`packages.${key}.duration`)}</Chip>
          )}
          {pkg.minPax > 1 && (
            <Chip Icon={Users} tone="yellow">
              {t('packages.min_pax')}
            </Chip>
          )}
        </div>

        {/* Inclusions */}
        <div className="mt-6">
          <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-brand-purple mb-3">
            {t('packages.inclusions_label')}
          </h4>
          <ul className="space-y-2">
            {Array.isArray(inclusions) &&
              inclusions.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-slate-700"
                >
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-purple" />
                  <span>{item}</span>
                </li>
              ))}
          </ul>
        </div>

        {/* Itinerary */}
        {pkg.hasItinerary && (
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setShowItinerary((v) => !v)}
              className="flex items-center gap-2 text-sm font-semibold text-brand-purple hover:text-brand-purple-900"
              aria-expanded={showItinerary}
            >
              {showItinerary
                ? t('packages.hide_details')
                : t('packages.view_details')}
              {showItinerary ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            <div
              className={`mt-4 overflow-hidden transition-[max-height,opacity] duration-500 ${
                showItinerary ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="relative pl-6 border-l-2 border-brand-purple-100 space-y-4">
                {Array.isArray(itinerary) &&
                  itinerary.map((step, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-[29px] top-1.5 h-3 w-3 rounded-full bg-brand-purple ring-4 ring-brand-purple-100" />
                      <div className="text-xs font-bold text-brand-purple uppercase tracking-wider">
                        {step.time}
                      </div>
                      <div className="text-sm text-slate-700 mt-0.5">
                        {step.desc}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex-1" />

        {/* Price + CTAs */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <PriceBlock pkg={pkg} />

          {/* Online payment is the primary action; WhatsApp stays available as
              the fallback the business already relies on. */}
          {IS_PAYMENT_CONFIGURED && (
            <button
              type="button"
              onClick={() => setBooking(true)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-brand-purple py-3.5 text-sm font-bold text-white shadow-brand transition hover:bg-brand-purple-800 hover:shadow-brand-lg"
            >
              <CreditCard className="h-4 w-4" />
              {t('booking.pay_online')}
            </button>
          )}

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={
              IS_PAYMENT_CONFIGURED
                ? 'mt-3 flex w-full items-center justify-center gap-2 rounded-full border-2 border-brand-purple py-3 text-sm font-bold text-brand-purple transition hover:bg-brand-purple-50'
                : 'mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-brand-purple py-3.5 text-sm font-bold text-white shadow-brand transition hover:bg-brand-purple-800 hover:shadow-brand-lg'
            }
          >
            <MessageCircle className="h-4 w-4" />
            {t('packages.book_button')}
          </a>
        </div>
      </div>

      {booking && (
        <BookingModal
          pkg={pkg}
          packageName={name}
          onClose={() => setBooking(false)}
        />
      )}
    </article>
  )
}

function Chip({ Icon, children, tone = 'purple' }) {
  const tones = {
    purple: 'bg-brand-purple-50 text-brand-purple',
    yellow: 'bg-brand-yellow-100 text-brand-yellow-600',
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${tones[tone]}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {children}
    </span>
  )
}

function PriceBlock({ pkg }) {
  const t = useTranslations('packages')

  if (hasDualPricing(pkg)) {
    return (
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-50 p-3">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            {t('price_sharing')}
          </div>
          <div className="font-display text-xl font-extrabold text-brand-navy-900 mt-0.5">
            {formatIDR(pkg.pricing.sharing)}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">{t('per_pax')}</div>
        </div>
        <div className="rounded-xl bg-brand-purple-50 p-3 border border-brand-purple-100">
          <div className="text-[10px] font-bold uppercase tracking-widest text-brand-purple">
            {t('price_private')}
          </div>
          <div className="font-display text-xl font-extrabold text-brand-purple mt-0.5">
            {formatIDR(pkg.pricing.private)}
          </div>
          <div className="text-[10px] text-brand-purple/70 mt-0.5">
            {t('per_pax')}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-end justify-between">
      <div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
          {t('from')}
        </div>
        <div className="font-display text-2xl md:text-3xl font-extrabold text-brand-purple leading-none mt-1">
          {formatIDR(pkg.pricing.fixed)}
        </div>
      </div>
      <div className="text-xs text-slate-500 pb-1">{t('per_pax')}</div>
    </div>
  )
}

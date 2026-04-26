import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Check,
  Clock,
  ChevronDown,
  ChevronUp,
  Users,
  MessageCircle,
  Star,
} from 'lucide-react'
import { formatIDR } from '../data/packages'
import { buildWhatsAppUrl } from '../data/location'

export default function PackageCard({ pkg }) {
  const { t, i18n } = useTranslation()
  const [showItinerary, setShowItinerary] = useState(false)
  const lang = i18n.language?.startsWith('id') ? 'id' : 'en'

  const Icon = pkg.icon
  const name = t(`packages.${pkg.translationKey}.name`)
  const tagline = t(`packages.${pkg.translationKey}.tagline`)
  // i18next needs returnObjects:true to return array, then we .map
  const inclusions = t(`packages.${pkg.translationKey}.inclusions`, {
    returnObjects: true,
  })
  const itinerary = pkg.hasItinerary
    ? t(`packages.${pkg.translationKey}.itinerary`, { returnObjects: true })
    : []

  const whatsappUrl = buildWhatsAppUrl(name, lang)

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:shadow-brand-lg hover:-translate-y-1 duration-300">
      {/* Popular badge */}
      {pkg.popular && (
        <div className="absolute top-4 right-4 z-10 inline-flex items-center gap-1 rounded-full bg-brand-yellow-400 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-navy-950 shadow-md">
          <Star className="h-3 w-3 fill-current" />
          {t('packages.popular')}
        </div>
      )}

      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={pkg.image}
          alt={name}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${pkg.accentClass} opacity-50`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {/* Icon chip */}
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

        {/* Meta: time / duration / min pax */}
        <div className="mt-4 flex flex-wrap gap-2">
          {pkg.hasFixedTime && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-purple-50 px-3 py-1 text-xs font-semibold text-brand-purple">
              <Clock className="h-3.5 w-3.5" />
              {t(`packages.${pkg.translationKey}.time`)}
            </span>
          )}
          {pkg.hasDuration && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-purple-50 px-3 py-1 text-xs font-semibold text-brand-purple">
              <Clock className="h-3.5 w-3.5" />
              {t(`packages.${pkg.translationKey}.duration`)}
            </span>
          )}
          {pkg.minPax > 1 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-yellow-100 px-3 py-1 text-xs font-semibold text-brand-yellow-600">
              <Users className="h-3.5 w-3.5" />
              {t('packages.min_pax')}
            </span>
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
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-purple" />
                  <span>{item}</span>
                </li>
              ))}
          </ul>
        </div>

        {/* Itinerary toggle */}
        {pkg.hasItinerary && (
          <div className="mt-6">
            <button
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
                      <div className="text-sm text-slate-700 mt-0.5">{step.desc}</div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex-1" />

        {/* Price + CTA */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <PriceBlock pkg={pkg} />
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-brand-purple py-3.5 text-sm font-bold text-white shadow-brand transition hover:bg-brand-purple-800 hover:shadow-brand-lg"
          >
            <MessageCircle className="h-4 w-4" />
            {t('packages.book_button')}
          </a>
        </div>
      </div>
    </article>
  )
}

function PriceBlock({ pkg }) {
  const { t } = useTranslation()

  if (pkg.pricing.sharing && pkg.pricing.private) {
    return (
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-50 p-3">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            {t('packages.price_sharing')}
          </div>
          <div className="font-display text-xl font-extrabold text-brand-navy-900 mt-0.5">
            {formatIDR(pkg.pricing.sharing)}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            {t('packages.per_pax')}
          </div>
        </div>
        <div className="rounded-xl bg-brand-purple-50 p-3 border border-brand-purple-100">
          <div className="text-[10px] font-bold uppercase tracking-widest text-brand-purple">
            {t('packages.price_private')}
          </div>
          <div className="font-display text-xl font-extrabold text-brand-purple mt-0.5">
            {formatIDR(pkg.pricing.private)}
          </div>
          <div className="text-[10px] text-brand-purple/70 mt-0.5">
            {t('packages.per_pax')}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-end justify-between">
      <div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
          {t('packages.from')}
        </div>
        <div className="font-display text-2xl md:text-3xl font-extrabold text-brand-purple leading-none mt-1">
          {formatIDR(pkg.pricing.fixed)}
        </div>
      </div>
      <div className="text-xs text-slate-500 pb-1">{t('packages.per_pax')}</div>
    </div>
  )
}

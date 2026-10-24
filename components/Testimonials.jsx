import { useTranslations, useLocale, useFormatter } from 'next-intl'
import { Star, ExternalLink, Quote } from 'lucide-react'

import { reviews, snapshot } from '@/data/reviews'

/**
 * Guest reviews from the Google Business Profile.
 *
 * This renders a manually curated snapshot (see data/reviews.js) — it does not
 * call the Places API. The live rating badge is shown by Google inside the map
 * embed in the Location section, so visitors always have a current number there.
 */
export default function Testimonials() {
  const t = useTranslations('testimonials')
  const locale = useLocale()
  const format = useFormatter()

  if (!reviews.length) return null

  return (
    <section
      id="reviews"
      className="section-padding bg-white relative overflow-hidden"
    >
      {/* Decorative background */}
      <div className="absolute -top-32 -left-24 h-80 w-80 rounded-full bg-brand-purple-50 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-brand-yellow-100/40 blur-3xl" />

      <div className="container-custom relative">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="section-label">{t('label')}</span>
          <h2 className="section-title">{t('title')}</h2>
          <div className="mx-auto mt-2 mb-6 h-1 w-16 rounded-full bg-brand-yellow-400" />

          <div className="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-2 rounded-2xl border border-slate-100 bg-white px-5 py-3 shadow-sm">
            <span className="font-display text-3xl font-extrabold text-brand-navy-900">
              {snapshot.rating.toFixed(1)}
            </span>
            <Stars value={snapshot.rating} />
            <span className="text-sm text-slate-500">
              {t('review_count', { count: snapshot.total })}
            </span>
          </div>
        </div>

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-start">
          {reviews.map((review) => {
            const body = review.text[locale] ?? review.text.en
            // Only text in the reviewer's own language is unlabelled. Reviews
            // without a `nativeLocale` reached us through a translation already,
            // so they carry the notice in every locale.
            const isTranslated = review.nativeLocale !== locale
            const [year, month] = review.date.split('-').map(Number)

            return (
              <li
                key={review.id}
                className="relative flex h-full flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-brand"
              >
                <Quote className="absolute right-5 top-5 h-8 w-8 text-brand-purple-50" />

                <Stars value={review.rating} />

                <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-700">
                  {body}
                </p>

                {isTranslated && (
                  <p className="mt-3 text-[11px] italic text-slate-400">
                    {t('translated')}
                  </p>
                )}

                <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
                  <Avatar name={review.author} />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-brand-navy-900">
                      {review.author}
                    </div>
                    <div className="text-xs text-slate-500">
                      {format.dateTime(new Date(Date.UTC(year, month - 1, 1)), {
                        year: 'numeric',
                        month: 'long',
                      })}
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>

        <div className="mt-10 text-center">
          <a
            href={snapshot.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            <ExternalLink className="h-4 w-4" />
            {t('read_all')}
          </a>
          <p className="mt-4 text-xs text-slate-400">{t('source')}</p>
        </div>
      </div>
    </section>
  )
}

function Stars({ value }) {
  const rounded = Math.round(value)
  return (
    <span
      className="inline-flex items-center gap-0.5"
      role="img"
      aria-label={`${value.toFixed(1)} / 5`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rounded
              ? 'fill-brand-yellow-400 text-brand-yellow-400'
              : 'text-slate-200'
          }`}
        />
      ))}
    </span>
  )
}

function Avatar({ name }) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
  return (
    <span className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full bg-brand-purple-50 text-sm font-bold text-brand-purple">
      {initials}
    </span>
  )
}

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Award, ShieldCheck, Heart, Layers } from 'lucide-react'

const features = [
  { key: 'guides', Icon: Award },
  { key: 'safety', Icon: ShieldCheck },
  { key: 'local', Icon: Heart },
  { key: 'flexible', Icon: Layers },
]

export default function About() {
  const t = useTranslations('about')

  return (
    <section id="about" className="section-padding bg-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute -top-32 -right-24 h-80 w-80 rounded-full bg-brand-purple-50 blur-3xl" />
      <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-brand-yellow-100/40 blur-3xl" />

      <div className="container-custom relative grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Text column */}
        <div>
          <span className="section-label">{t('label')}</span>
          <h2 className="section-title">{t('title')}</h2>
          <div className="mt-2 mb-8 h-1 w-16 rounded-full bg-brand-yellow-400" />
          <p className="text-slate-600 leading-relaxed mb-4">{t('p1')}</p>
          <p className="text-slate-600 leading-relaxed">{t('p2')}</p>

          <div className="mt-10 grid sm:grid-cols-2 gap-5">
            {features.map(({ key, Icon }) => (
              <div
                key={key}
                className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-brand hover:border-brand-purple-100 transition"
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-purple-50 text-brand-purple group-hover:bg-brand-purple group-hover:text-white transition">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display font-semibold text-brand-navy-900">
                  {t(`features.${key}_title`)}
                </h3>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                  {t(`features.${key}_desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Image column */}
        <div className="relative">
          <div className="relative h-[420px] sm:h-[480px] lg:h-[560px] overflow-hidden rounded-3xl shadow-brand-lg">
            <Image
              src="/about.jpg"
              alt={t('title')}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-950/40 to-transparent" />
          </div>
          {/* Floating badge */}
          <div className="absolute -bottom-6 -left-2 sm:-left-6 rounded-2xl bg-brand-yellow-400 px-5 sm:px-6 py-4 sm:py-5 shadow-xl">
            <div className="font-display text-2xl sm:text-3xl font-extrabold text-brand-navy-950 leading-none">
              UNESCO
            </div>
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-brand-navy-950/80 mt-1">
              Global Geopark
            </div>
          </div>
          <div className="absolute -top-6 -right-2 sm:-right-6 rounded-2xl bg-white px-5 py-4 shadow-xl border border-slate-100">
            <div className="font-display text-2xl sm:text-3xl font-extrabold text-brand-purple leading-none">
              1,717
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">
              M.a.s.l
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

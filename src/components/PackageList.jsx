import { useTranslation } from 'react-i18next'
import PackageCard from './PackageCard'
import { packages } from '../data/packages'

export default function PackageList() {
  const { t } = useTranslation()

  return (
    <section id="packages" className="section-padding bg-slate-50 relative overflow-hidden">
      {/* Decorative bg */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-72 w-[120%] bg-gradient-to-b from-white to-transparent pointer-events-none" />

      <div className="container-custom relative">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="section-label">{t('packages.label')}</span>
          <h2 className="section-title">{t('packages.title')}</h2>
          <div className="mx-auto mt-2 mb-6 h-1 w-16 rounded-full bg-brand-yellow-400" />
          <p className="section-subtitle mx-auto text-center">
            {t('packages.subtitle')}
          </p>
        </div>

        <div className="grid gap-6 md:gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      </div>
    </section>
  )
}

import { useTranslations } from 'next-intl'

import { Link } from '@/i18n/navigation'

export default function NotFound() {
  const t = useTranslations('nav')

  return (
    <main className="grid min-h-[100svh] place-items-center bg-brand-navy-950 px-6 text-center">
      <div>
        <p className="font-display text-7xl font-extrabold text-brand-yellow-400">
          404
        </p>
        <h1 className="mt-4 font-display text-2xl font-bold text-white">
          Mount Batur is that way
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          The page you were looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="btn-yellow mt-8 inline-flex"
        >
          {t('home')}
        </Link>
      </div>
    </main>
  )
}

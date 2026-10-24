'use client'

import { useState, useEffect, useRef, useTransition } from 'react'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { Menu, X, Globe, Check, ChevronDown } from 'lucide-react'

import { usePathname, useRouter } from '@/i18n/navigation'
import { routing, localeMeta } from '@/i18n/routing'

const navItems = ['home', 'about', 'packages', 'gallery', 'location']
const anchors = {
  home: '#hero',
  about: '#about',
  packages: '#packages',
  gallery: '#gallery',
  location: '#location',
}

export default function Navbar() {
  const t = useTranslations('nav')
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = () => setOpen(false)

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 shadow-md backdrop-blur-sm' : 'bg-transparent'
      }`}
    >
      <nav className="container-custom flex items-center justify-between py-4">
        {/* Logo */}
        <a
          href="#hero"
          onClick={closeMenu}
          className="flex items-center gap-2 font-display font-bold text-base sm:text-lg"
        >
          <Image
            src="/logo/HdLogoMJS.png"
            alt="Mountaint Jeep Sunrise"
            width={40}
            height={40}
            priority
            className="h-10 w-10 rounded-xl bg-brand-purple object-contain shadow-brand"
          />
          <span
            className={
              scrolled ? 'text-brand-navy-900' : 'text-white drop-shadow-md'
            }
          >
            Mountaint Jeep{' '}
            <span className="text-brand-yellow-400">Sunrise</span>
          </span>
        </a>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-1">
          {navItems.map((key) => (
            <li key={key}>
              <a
                href={anchors[key]}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  scrolled
                    ? 'text-slate-700 hover:text-brand-purple hover:bg-brand-purple-50'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                {t(key)}
              </a>
            </li>
          ))}
        </ul>

        {/* Right side: language + CTA + hamburger */}
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher scrolled={scrolled} />

          <a
            href="#packages"
            className="hidden sm:inline-flex btn-yellow !py-2 !px-5"
          >
            {t('book')}
          </a>

          <button
            onClick={() => setOpen((v) => !v)}
            className={`lg:hidden grid h-10 w-10 place-items-center rounded-xl transition ${
              scrolled
                ? 'bg-brand-purple-50 text-brand-purple'
                : 'bg-white/15 text-white backdrop-blur-sm'
            }`}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`lg:hidden overflow-hidden bg-white shadow-xl transition-[max-height] duration-300 ${
          open ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <ul className="container-custom py-4 flex flex-col gap-1">
          {navItems.map((key) => (
            <li key={key}>
              <a
                href={anchors[key]}
                onClick={closeMenu}
                className="block rounded-xl px-4 py-3 text-base font-medium text-slate-700 hover:bg-brand-purple-50 hover:text-brand-purple"
              >
                {t(key)}
              </a>
            </li>
          ))}
          <li className="pt-2">
            <a
              href="#packages"
              onClick={closeMenu}
              className="btn-yellow w-full justify-center"
            >
              {t('book')}
            </a>
          </li>
        </ul>
      </div>
    </header>
  )
}

/**
 * EN | ID | ZH switcher. Navigating with next-intl's router swaps the locale
 * prefix on the current path and persists the choice in the NEXT_LOCALE cookie,
 * so a return visit lands on the same language.
 */
function LanguageSwitcher({ scrolled }) {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    const onKeyDown = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const select = (next) => {
    setOpen(false)
    if (next === locale) return
    startTransition(() => {
      router.replace(pathname, { locale: next })
    })
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={isPending}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Change language"
        className={`flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold transition disabled:opacity-60 ${
          scrolled
            ? 'border-slate-200 bg-white text-slate-700 hover:border-brand-purple-200 hover:text-brand-purple'
            : 'border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20'
        }`}
      >
        <Globe className="h-4 w-4" />
        <span>{localeMeta[locale].short}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 mt-2 w-48 overflow-hidden rounded-2xl border border-slate-100 bg-white py-1.5 shadow-xl"
        >
          {routing.locales.map((l) => (
            <li key={l}>
              <button
                type="button"
                role="option"
                aria-selected={l === locale}
                onClick={() => select(l)}
                className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition hover:bg-brand-purple-50 ${
                  l === locale
                    ? 'font-semibold text-brand-purple'
                    : 'text-slate-700'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <span className="w-7 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {localeMeta[l].short}
                  </span>
                  {localeMeta[l].label}
                </span>
                {l === locale && <Check className="h-4 w-4 flex-shrink-0" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

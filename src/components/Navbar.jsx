import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Menu, X, Mountain, Globe } from 'lucide-react'

const navItems = [
  { key: 'home', href: '#hero' },
  { key: 'about', href: '#about' },
  { key: 'packages', href: '#packages' },
  { key: 'gallery', href: '#gallery' },
  { key: 'location', href: '#location' },
]

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const currentLang = i18n.language?.startsWith('id') ? 'id' : 'en'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const changeLang = (lng) => {
    i18n.changeLanguage(lng)
    localStorage.setItem('i18nextLng', lng)
  }

  const closeMenu = () => setOpen(false)

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 shadow-md backdrop-blur-sm'
          : 'bg-transparent'
      }`}
    >
      <nav className="container-custom flex items-center justify-between py-4">
        {/* Logo */}
        <a
          href="#hero"
          onClick={closeMenu}
          className="flex items-center gap-2 font-display font-bold text-lg"
        >
          <img src="/logo/HdLogoMJS.png" alt="HdLogoMJS" className="h-10 w-10 rounded-xl bg-brand-purple text-brand-yellow-400 shadow-brand object-contain" />
          <span className={scrolled ? 'text-brand-navy-900' : 'text-white drop-shadow-md'}>
            Mountaint Jeep <span className="text-brand-yellow-400">Sunrise</span>
          </span>
        </a>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <li key={item.key}>
              <a
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  scrolled
                    ? 'text-slate-700 hover:text-brand-purple hover:bg-brand-purple-50'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                {t(`nav.${item.key}`)}
              </a>
            </li>
          ))}
        </ul>

        {/* Right side: language + CTA + hamburger */}
        <div className="flex items-center gap-3">
          {/* Language toggle */}
          <div
            className={`flex items-center rounded-full border p-1 ${
              scrolled
                ? 'border-slate-200 bg-white'
                : 'border-white/30 bg-white/10 backdrop-blur-sm'
            }`}
          >
            <button
              onClick={() => changeLang('en')}
              className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition ${
                currentLang === 'en'
                  ? 'bg-brand-purple text-white shadow-sm'
                  : scrolled
                  ? 'text-slate-600 hover:text-brand-purple'
                  : 'text-white/80 hover:text-white'
              }`}
              aria-label="English"
            >
              EN
            </button>
            <button
              onClick={() => changeLang('id')}
              className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition ${
                currentLang === 'id'
                  ? 'bg-brand-purple text-white shadow-sm'
                  : scrolled
                  ? 'text-slate-600 hover:text-brand-purple'
                  : 'text-white/80 hover:text-white'
              }`}
              aria-label="Indonesian"
            >
              ID
            </button>
          </div>

          {/* Desktop CTA */}
          <a href="#packages" className="hidden sm:inline-flex btn-yellow !py-2 !px-5">
            {t('nav.book')}
          </a>

          {/* Hamburger */}
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
          {navItems.map((item) => (
            <li key={item.key}>
              <a
                href={item.href}
                onClick={closeMenu}
                className="block rounded-xl px-4 py-3 text-base font-medium text-slate-700 hover:bg-brand-purple-50 hover:text-brand-purple"
              >
                {t(`nav.${item.key}`)}
              </a>
            </li>
          ))}
          <li className="pt-2">
            <a
              href="#packages"
              onClick={closeMenu}
              className="btn-yellow w-full justify-center"
            >
              {t('nav.book')}
            </a>
          </li>
        </ul>
      </div>
    </header>
  )
}

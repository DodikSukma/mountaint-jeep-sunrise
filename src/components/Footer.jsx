import { useTranslation } from 'react-i18next'
import { Mountain, Instagram, Facebook, MessageCircle, MapPin, Phone } from 'lucide-react'
import { location } from '../data/location'

const navItems = [
  { key: 'home', href: '#hero' },
  { key: 'about', href: '#about' },
  { key: 'packages', href: '#packages' },
  { key: 'gallery', href: '#gallery' },
  { key: 'location', href: '#location' },
]

export default function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer className="bg-brand-navy-950 text-slate-300 relative overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute -top-24 left-1/4 h-64 w-64 rounded-full bg-brand-purple-700/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 right-1/4 h-64 w-64 rounded-full bg-brand-yellow-400/10 blur-3xl pointer-events-none" />

      <div className="container-custom relative py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 font-display font-bold text-lg text-white">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-purple text-brand-yellow-400">
                <Mountain className="h-5 w-5" />
              </span>
              Batur<span className="text-brand-yellow-400">Sunrise</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              {t('footer.tagline')}
            </p>
            {/* Socials */}
            <div className="mt-6 flex items-center gap-3">
              <SocialLink href={location.social.instagram} Icon={Instagram} label="Instagram" />
              <SocialLink href={location.social.facebook} Icon={Facebook} label="Facebook" />
              <SocialLink
                href={location.social.whatsapp}
                Icon={MessageCircle}
                label="WhatsApp"
              />
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-[0.15em] text-white mb-4">
              {t('footer.quick_links')}
            </h3>
            <ul className="space-y-2.5">
              {navItems.map((item) => (
                <li key={item.key}>
                  <a
                    href={item.href}
                    className="text-sm text-slate-400 hover:text-brand-yellow-400 transition"
                  >
                    {t(`nav.${item.key}`)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-[0.15em] text-white mb-4">
              {t('footer.contact')}
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-yellow-400" />
                <span className="text-slate-400 leading-relaxed">{location.address}</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-yellow-400" />
                <a
                  href={`tel:${location.phoneRaw}`}
                  className="text-slate-400 hover:text-brand-yellow-400 transition"
                >
                  {location.phone}
                </a>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-[0.15em] text-white mb-4">
              {t('footer.follow')}
            </h3>
            <a
              href={location.social.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-brand-yellow-400 px-5 py-3 text-sm font-bold text-brand-navy-950 shadow-lg transition hover:bg-brand-yellow-500"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
            <p className="mt-4 text-xs text-slate-500 leading-relaxed">
              {location.contactPerson}
              <br />
              {location.phone}
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {year} Batur Jeep Sunrise and Tracking. {t('footer.rights')}
          </p>
          <p>Kintamani · Bangli · Bali · Indonesia</p>
        </div>
      </div>
    </footer>
  )
}

function SocialLink({ href, Icon, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-slate-300 transition hover:bg-brand-yellow-400 hover:text-brand-navy-950"
    >
      <Icon className="h-4 w-4" />
    </a>
  )
}

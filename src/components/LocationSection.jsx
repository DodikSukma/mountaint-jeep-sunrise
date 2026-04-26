import { useTranslation } from 'react-i18next'
import { MapPin, Phone, User, ExternalLink, MessageCircle } from 'lucide-react'
import { location } from '../data/location'

export default function LocationSection() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.startsWith('id') ? 'id' : 'en'

  const whatsappText =
    lang === 'id'
      ? 'Halo, saya ingin informasi Batur Sunrise Trekking'
      : 'Hello, I want information about Batur Sunrise Trekking'
  const whatsappUrl = `https://wa.me/${location.phoneRaw}?text=${encodeURIComponent(
    whatsappText
  )}`

  return (
    <section id="location" className="section-padding bg-slate-50 relative overflow-hidden">
      <div className="container-custom relative">
        <div className="max-w-3xl mb-14">
          <span className="section-label">{t('location.label')}</span>
          <h2 className="section-title">{t('location.title')}</h2>
          <div className="mt-2 mb-6 h-1 w-16 rounded-full bg-brand-yellow-400" />
          <p className="section-subtitle">{t('location.subtitle')}</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Info card */}
          <div className="lg:col-span-2 rounded-3xl bg-white p-8 shadow-sm border border-slate-100">
            <div className="space-y-6">
              <InfoRow
                Icon={MapPin}
                label={t('location.address_label')}
                value={location.address}
              />
              <InfoRow
                Icon={User}
                label={t('location.contact_label')}
                value={location.contactPerson}
              />
              <InfoRow
                Icon={Phone}
                label={t('location.phone_label')}
                value={location.phone}
                href={`tel:${location.phoneRaw}`}
              />
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <a
                href={location.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full"
              >
                <ExternalLink className="h-4 w-4" />
                {t('location.open_maps')}
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-yellow w-full"
              >
                <MessageCircle className="h-4 w-4" />
                {t('location.chat_whatsapp')}
              </a>
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-3 relative overflow-hidden rounded-3xl shadow-brand border border-slate-100">
            <iframe
              title="Batur Sunrise Trekking Location"
              src={location.mapsEmbed}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '420px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function InfoRow({ Icon, label, value, href }) {
  const inner = (
    <div className="flex items-start gap-4">
      <div className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl bg-brand-purple-50 text-brand-purple">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500">
          {label}
        </div>
        <div className="mt-1 text-sm md:text-base font-medium text-brand-navy-900 break-words">
          {value}
        </div>
      </div>
    </div>
  )

  if (href) {
    return (
      <a href={href} className="block hover:opacity-80 transition">
        {inner}
      </a>
    )
  }
  return inner
}

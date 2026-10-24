/**
 * Google Business Profile identifiers for "Mountain Jeep Sunrise (MJS)".
 * The CID is the stable numeric id of the listing — it's what makes the map
 * pin show the business (name, hours, reviews) instead of a bare coordinate.
 * Source: https://maps.app.goo.gl/mCoNHEfivXAJH9Mr8
 */
export const GOOGLE_PLACE = {
  name: 'Mountain Jeep Sunrise (MJS)',
  cid: '7839094657144270127', // hex 0x6cca0f0eafbf2d2f
  plusCode: 'P84Q+CWR Bayung Gede, Bangli Regency, Bali',
  shortUrl: 'https://maps.app.goo.gl/mCoNHEfivXAJH9Mr8',
  lat: -8.294091,
  lng: 115.3400959,
}

export const location = {
  businessName: 'Batur Jeep Sunrise and Tracking',
  contactPerson: 'Adi Parwata',
  phone: '+62 812-2860-1710',
  phoneRaw: '6281228601710',
  email: 'info@jeepsunrisebali.com',
  address: 'Bayung Gede, Kintamani, Bangli Regency, Bali 80652, Indonesia',
  coordinates: { lat: GOOGLE_PLACE.lat, lng: GOOGLE_PLACE.lng },
  // Short link straight to the Google Business Profile.
  mapsUrl: GOOGLE_PLACE.shortUrl,
  social: {
    instagram: 'https://instagram.com/jeepsunrisebali',
    facebook: 'https://facebook.com/jeepsunrisebali',
    whatsapp: 'https://wa.me/6281228601710',
  },
}

/** Google Maps' own language codes differ slightly from our locale codes. */
const MAP_LANG = { en: 'en', id: 'id', zh: 'zh-CN' }

/**
 * Build the Google Maps iframe URL for the business listing, localized.
 * Keyless (no Maps API billing) — this is the `output=embed` endpoint that
 * maps.google.com resolves a `cid` link to.
 *
 * @param {'en'|'id'|'zh'} locale
 */
export const buildMapsEmbed = (locale = 'en') => {
  const lang = MAP_LANG[locale] ?? 'en'
  return `https://www.google.com/maps/embed?origin=mfe&pb=!1m4!3m2!1m1!4s${GOOGLE_PLACE.cid}!6i16!3m1!1s${lang}!5m1!1s${lang}`
}

const bookingGreeting = {
  en: (name) => `Hello, I want to book the ${name}`,
  id: (name) => `Halo, saya ingin memesan ${name}`,
  zh: (name) => `您好，我想预订${name}`,
}

const enquiryGreeting = {
  en: 'Hello, I want information about Batur Sunrise Trekking',
  id: 'Halo, saya ingin informasi Batur Sunrise Trekking',
  zh: '您好，我想咨询巴图尔火山日出徒步的信息',
}

/**
 * Build a WhatsApp URL with a pre-filled booking message.
 * @param {string} packageName - Name of the package to book
 * @param {'en'|'id'|'zh'} lang
 */
export const buildWhatsAppUrl = (packageName, lang = 'en') => {
  const build = bookingGreeting[lang] ?? bookingGreeting.en
  return `https://wa.me/${location.phoneRaw}?text=${encodeURIComponent(
    build(packageName)
  )}`
}

/**
 * Build a WhatsApp URL with a pre-filled general enquiry message.
 * @param {'en'|'id'|'zh'} lang
 */
export const buildEnquiryUrl = (lang = 'en') => {
  const text = enquiryGreeting[lang] ?? enquiryGreeting.en
  return `https://wa.me/${location.phoneRaw}?text=${encodeURIComponent(text)}`
}

export const location = {
  businessName: 'Batur Jeep Sunrise and Tracking',
  contactPerson: 'Adi Parwata',
  phone: '+62 812-2860-1710',
  phoneRaw: '6281228601710',
  email: 'info@jeepsunrisebali.com',
  address: 'Jalan Raya Sekaan, Kintamani, Bangli, Bali, Indonesia',
  mapsUrl:
    "https://www.google.com/maps/place/8%C2%B017'38.5%22S+115%C2%B020'23.5%22E/@-8.2918828,115.3311625,15.88z/data=!4m4!3m3!8m2!3d-8.2940321!4d115.339859?hl=en&entry=ttu&g_ep=EgoyMDI2MDQxNS4wIKXMDSoASAFQAw%3D%3D",
  // Google Maps embed — derived from the coordinates above
  mapsEmbed:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3949.8!2d115.339859!3d-8.2940321!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOMKwMTcnMzguNSJTIDExNcKwMjAnMjMuNSJF!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid',
  social: {
    instagram: 'https://instagram.com/jeepsunrisebali',
    facebook: 'https://facebook.com/jeepsunrisebali',
    whatsapp: 'https://wa.me/6281228601710',
  },
}

/**
 * Build a WhatsApp URL with a pre-filled message for booking.
 * @param {string} packageName - Name of the package to book
 * @param {string} lang - 'en' or 'id'
 */
export const buildWhatsAppUrl = (packageName, lang = 'en') => {
  const greeting =
    lang === 'id'
      ? `Halo, saya ingin memesan ${packageName}`
      : `Hello, I want to book the ${packageName}`
  return `https://wa.me/${location.phoneRaw}?text=${encodeURIComponent(greeting)}`
}

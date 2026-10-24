import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.js')

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Every asset is local (/public), so no remotePatterns are needed.
    // AVIF first, WebP fallback — the gallery is 110 photos, so payload matters.
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [64, 96, 128, 256, 384],
    // Next 16 only honours `quality` values listed here (default is [75] alone).
    // 70 for the 110 gallery thumbnails, 75 for hero/cards, 82 for the lightbox.
    qualities: [70, 75, 82],
  },
  async redirects() {
    return [
      // The old SPA used ?lng=xx. Keep those links alive as locale routes.
      {
        source: '/',
        has: [{ type: 'query', key: 'lng', value: 'id' }],
        destination: '/id',
        permanent: true,
      },
      {
        source: '/',
        has: [{ type: 'query', key: 'lng', value: 'zh' }],
        destination: '/zh',
        permanent: true,
      },
    ]
  },
}

export default withNextIntl(nextConfig)

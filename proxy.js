import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

// Next 16 renamed the `middleware` file convention to `proxy`.
// next-intl still ships its handler under `next-intl/middleware`.
export default createMiddleware(routing)

export const config = {
  // Run on every page route, but skip API routes, Next internals,
  // and anything with a file extension (images, sitemap.xml, robots.txt…).
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)',
}

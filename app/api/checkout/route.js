import { NextResponse } from 'next/server'

import {
  getPackage,
  getUnitPrice,
  hasDualPricing,
} from '@/data/packages'
import { buildOrderId, createSnapTransaction } from '@/lib/midtrans'
import { routing } from '@/i18n/routing'

// Payment creation must never be cached or prerendered.
export const dynamic = 'force-dynamic'

const MAX_PAX = 20
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const bad = (error, status = 400) => NextResponse.json({ error }, { status })

/** Collapse whitespace and cap length so nothing oversized reaches Midtrans. */
const clean = (value, max) =>
  typeof value === 'string' ? value.trim().replace(/\s+/g, ' ').slice(0, max) : ''

/** Reject dates that aren't a real YYYY-MM-DD from today onward. */
function parseTourDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? '')) return null
  const date = new Date(`${value}T00:00:00Z`)
  if (Number.isNaN(date.getTime())) return null
  const today = new Date()
  const todayUtc = Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate()
  )
  // Bali is UTC+8; allow one day of slack so a late-evening local booking
  // for "today" isn't rejected by a UTC-midnight comparison.
  return date.getTime() >= todayUtc - 86_400_000 ? value : null
}

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return bad('invalid_json')
  }

  const {
    packageId,
    quantity,
    tourType,
    name,
    email,
    phone,
    date,
    locale: rawLocale,
  } = body ?? {}

  // --- Package -------------------------------------------------------------
  const pkg = getPackage(packageId)
  if (!pkg) return bad('unknown_package')

  // --- Quantity ------------------------------------------------------------
  const qty = Number(quantity)
  if (!Number.isInteger(qty) || qty < 1 || qty > MAX_PAX) {
    return bad('invalid_quantity')
  }
  if (qty < pkg.minPax) return bad('below_minimum_pax')

  // --- Tour type & price ---------------------------------------------------
  // The unit price is resolved from server-side data. A price sent by the
  // client is ignored entirely, so the amount can't be tampered with.
  const dual = hasDualPricing(pkg)
  const type = dual ? tourType : undefined
  if (dual && type !== 'sharing' && type !== 'private') {
    return bad('invalid_tour_type')
  }
  const unitPrice = getUnitPrice(pkg, type)
  if (unitPrice == null) return bad('price_unavailable')

  // --- Customer ------------------------------------------------------------
  const fullName = clean(name, 60)
  const customerEmail = clean(email, 120)
  const customerPhone = clean(phone, 30)
  if (!fullName || !customerEmail || !customerPhone) return bad('missing_fields')
  if (!EMAIL_RE.test(customerEmail)) return bad('invalid_email')

  const tourDate = parseTourDate(date)
  if (!tourDate) return bad('invalid_date')

  const locale = routing.locales.includes(rawLocale)
    ? rawLocale
    : routing.defaultLocale

  // --- Create the Snap transaction ----------------------------------------
  const [firstName, ...rest] = fullName.split(' ')
  const grossAmount = unitPrice * qty
  const orderId = buildOrderId(pkg.id)

  const itemLabel = dual
    ? `${pkg.id.toUpperCase()} (${type})`
    : pkg.id.toUpperCase()

  try {
    const { token, redirect_url } = await createSnapTransaction({
      orderId,
      grossAmount,
      customer: {
        firstName,
        lastName: rest.join(' '),
        email: customerEmail,
        phone: customerPhone,
      },
      items: [
        {
          id: pkg.id,
          price: unitPrice,
          quantity: qty,
          name: `${itemLabel} - ${tourDate}`,
        },
      ],
      locale,
      custom: { packageId: pkg.id, tourDate, tourType: type ?? 'fixed' },
    })

    return NextResponse.json({
      token,
      redirect_url,
      orderId,
      grossAmount,
    })
  } catch (error) {
    // Log server-side; return an opaque message so Midtrans internals and the
    // server key never leak to the browser.
    console.error('[checkout] Midtrans createTransaction failed:', {
      orderId,
      message: error?.message,
      apiResponse: error?.ApiResponse,
    })
    return bad('payment_gateway_error', 502)
  }
}

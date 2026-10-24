import crypto from 'node:crypto'
import midtransClient from 'midtrans-client'

import { SITE_URL } from './site'

/**
 * Server-side Midtrans helper.
 *
 * Never import this from a Client Component — it reads MIDTRANS_SERVER_KEY,
 * which must stay on the server. Only NEXT_PUBLIC_MIDTRANS_CLIENT_KEY is safe
 * to expose to the browser (the Snap.js popup needs it).
 */

export const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true'

/** Snap.js script URL — sandbox and production are different hosts. */
export const SNAP_SCRIPT_URL = isProduction
  ? 'https://app.midtrans.com/snap/snap.js'
  : 'https://app.sandbox.midtrans.com/snap/snap.js'

function requireServerKey() {
  const key = process.env.MIDTRANS_SERVER_KEY
  if (!key) {
    throw new Error(
      'MIDTRANS_SERVER_KEY is not set. Copy .env.local.example to .env.local and fill in your Midtrans credentials.'
    )
  }
  return key
}

// Clients are created lazily so a missing key surfaces as a clean 500 at
// request time rather than crashing the build when routes are collected.
let snapClient
let coreClient

function getSnap() {
  if (!snapClient) {
    snapClient = new midtransClient.Snap({
      isProduction,
      serverKey: requireServerKey(),
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
    })
  }
  return snapClient
}

function getCore() {
  if (!coreClient) {
    coreClient = new midtransClient.CoreApi({
      isProduction,
      serverKey: requireServerKey(),
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
    })
  }
  return coreClient
}

/** Generate a collision-resistant, human-readable order id. */
export function buildOrderId(packageId) {
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const rand = crypto.randomBytes(4).toString('hex').toUpperCase()
  return `MJS-${packageId.toUpperCase()}-${stamp}-${rand}`
}

/**
 * Create a Snap transaction and return the token + redirect URL.
 *
 * @param {object}   params
 * @param {string}   params.orderId
 * @param {number}   params.grossAmount  - total in IDR, must equal the sum of item_details
 * @param {object}   params.customer     - { firstName, lastName, email, phone }
 * @param {object[]} params.items        - [{ id, price, quantity, name }]
 * @param {string}   [params.locale]     - 'en' | 'id' | 'zh'
 * @param {object}   [params.custom]     - extra fields echoed back in custom_field1..3
 * @returns {Promise<{token: string, redirect_url: string}>}
 */
export async function createSnapTransaction({
  orderId,
  grossAmount,
  customer,
  items,
  locale = 'en',
  custom = {},
}) {
  const parameter = {
    transaction_details: {
      order_id: orderId,
      gross_amount: grossAmount,
    },
    item_details: items.map((item) => ({
      id: item.id,
      price: item.price,
      quantity: item.quantity,
      name: item.name.slice(0, 50), // Midtrans truncates past 50 chars
    })),
    customer_details: {
      first_name: customer.firstName,
      last_name: customer.lastName || '',
      email: customer.email,
      phone: customer.phone,
    },
    // Snap only ships English and Indonesian; Chinese visitors get English.
    credit_card: { secure: true },
    locale: locale === 'id' ? 'id' : 'en',
    callbacks: {
      finish: `${SITE_URL}/${locale}?payment=finish`,
    },
    custom_field1: custom.packageId ?? '',
    custom_field2: custom.tourDate ?? '',
    custom_field3: custom.tourType ?? '',
  }

  const result = await getSnap().createTransaction(parameter)
  return { token: result.token, redirect_url: result.redirect_url }
}

/**
 * Verify a Midtrans HTTP notification.
 *
 * Midtrans signs each notification with:
 *   sha512(order_id + status_code + gross_amount + server_key)
 *
 * A forged callback that doesn't reproduce this hash is rejected. Compared with
 * a timing-safe equality check so the signature can't be probed byte by byte.
 *
 * @param {object} body - the parsed notification JSON
 * @returns {{valid: boolean, orderId?: string, transactionStatus?: string, fraudStatus?: string, reason?: string}}
 */
export function verifyNotification(body) {
  const {
    order_id: orderId,
    status_code: statusCode,
    gross_amount: grossAmount,
    signature_key: signatureKey,
    transaction_status: transactionStatus,
    fraud_status: fraudStatus,
  } = body ?? {}

  if (!orderId || !statusCode || !grossAmount || !signatureKey) {
    return { valid: false, reason: 'missing_fields' }
  }

  const expected = crypto
    .createHash('sha512')
    .update(`${orderId}${statusCode}${grossAmount}${requireServerKey()}`)
    .digest('hex')

  const received = String(signatureKey)
  const valid =
    received.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(received), Buffer.from(expected))

  if (!valid) return { valid: false, reason: 'bad_signature' }

  return { valid: true, orderId, transactionStatus, fraudStatus }
}

/**
 * Re-fetch a transaction's status straight from Midtrans.
 * Defence in depth: the signature proves the payload wasn't forged, this proves
 * the payload isn't a stale replay.
 */
export async function fetchTransactionStatus(orderId) {
  return getCore().transaction.status(orderId)
}

/**
 * Map a Midtrans transaction/fraud status pair onto our own booking states.
 * @returns {'paid'|'pending'|'challenge'|'failed'|'unknown'}
 */
export function resolveBookingState(transactionStatus, fraudStatus) {
  switch (transactionStatus) {
    case 'capture':
      if (fraudStatus === 'challenge') return 'challenge'
      if (fraudStatus === 'accept') return 'paid'
      return 'unknown'
    case 'settlement':
      return 'paid'
    case 'pending':
      return 'pending'
    case 'deny':
    case 'cancel':
    case 'expire':
    case 'failure':
      return 'failed'
    default:
      return 'unknown'
  }
}

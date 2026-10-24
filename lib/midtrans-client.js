/**
 * Browser-safe Midtrans constants.
 *
 * Only the *client* key belongs here — it's published to the bundle by design.
 * The server key and MIDTRANS_IS_PRODUCTION live in lib/midtrans.js and must
 * never be imported from a Client Component.
 */
export const MIDTRANS_CLIENT_KEY =
  process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ?? ''

// Midtrans prefixes sandbox client keys with "SB-", so the correct Snap host
// can be derived from the key itself instead of a second public env var.
export const IS_SANDBOX = MIDTRANS_CLIENT_KEY.startsWith('SB-')

export const SNAP_SCRIPT_URL = IS_SANDBOX
  ? 'https://app.sandbox.midtrans.com/snap/snap.js'
  : 'https://app.midtrans.com/snap/snap.js'

/** False when the client key is missing, so the UI can hide online payment. */
export const IS_PAYMENT_CONFIGURED = MIDTRANS_CLIENT_KEY.length > 0

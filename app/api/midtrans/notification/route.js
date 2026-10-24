import { NextResponse } from 'next/server'

import {
  verifyNotification,
  fetchTransactionStatus,
  resolveBookingState,
} from '@/lib/midtrans'

// Webhooks must always hit the function, never a cached response.
export const dynamic = 'force-dynamic'

/**
 * Midtrans HTTP notification (webhook) endpoint.
 *
 * Configure this URL in the Midtrans dashboard under
 * Settings → Configuration → Payment Notification URL:
 *   https://<your-domain>/api/midtrans/notification
 *
 * Handles: capture, settlement, pending, deny, cancel, expire, failure.
 *
 * Always answers 200 for a *validly signed* notification, even when our own
 * downstream handling fails — Midtrans retries non-2xx responses, and retrying
 * won't fix a bug on our side. Invalid signatures get 403 so forged calls are
 * visibly rejected.
 */
export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const verified = verifyNotification(body)
  if (!verified.valid) {
    console.warn('[midtrans:webhook] rejected notification:', {
      reason: verified.reason,
      orderId: body?.order_id,
    })
    return NextResponse.json({ error: 'invalid_signature' }, { status: 403 })
  }

  const { orderId } = verified
  let { transactionStatus, fraudStatus } = verified

  // Re-read the authoritative status from Midtrans so a replayed (correctly
  // signed but stale) notification can't move a booking backwards.
  try {
    const fresh = await fetchTransactionStatus(orderId)
    if (fresh?.transaction_status) {
      transactionStatus = fresh.transaction_status
      fraudStatus = fresh.fraud_status
    }
  } catch (error) {
    console.warn('[midtrans:webhook] status re-check failed, using payload:', {
      orderId,
      message: error?.message,
    })
  }

  const state = resolveBookingState(transactionStatus, fraudStatus)

  // ---------------------------------------------------------------------
  // Persistence hook.
  //
  // This site has no database yet, so settled bookings are logged for the
  // operator to reconcile against the Midtrans dashboard. Wire an order store
  // (and the confirmation email / WhatsApp message) in here when one exists —
  // the handler is already idempotent, which is what a retrying webhook needs.
  // ---------------------------------------------------------------------
  switch (state) {
    case 'paid':
      console.info('[midtrans:webhook] PAID', {
        orderId,
        grossAmount: body.gross_amount,
        paymentType: body.payment_type,
        packageId: body.custom_field1,
        tourDate: body.custom_field2,
        tourType: body.custom_field3,
      })
      break
    case 'pending':
      console.info('[midtrans:webhook] PENDING', { orderId })
      break
    case 'challenge':
      console.warn('[midtrans:webhook] FRAUD CHALLENGE — review in dashboard', {
        orderId,
      })
      break
    case 'failed':
      console.info('[midtrans:webhook] FAILED', { orderId, transactionStatus })
      break
    default:
      console.warn('[midtrans:webhook] UNKNOWN status', {
        orderId,
        transactionStatus,
        fraudStatus,
      })
  }

  return NextResponse.json({ received: true, orderId, state })
}

/** Convenience probe so the endpoint can be smoke-tested from a browser. */
export function GET() {
  return NextResponse.json({
    endpoint: 'midtrans-notification',
    method: 'POST',
    status: 'ready',
  })
}

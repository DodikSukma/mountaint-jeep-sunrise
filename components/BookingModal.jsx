'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useTranslations, useLocale } from 'next-intl'
import {
  X,
  Loader2,
  CheckCircle2,
  Clock,
  AlertCircle,
  MessageCircle,
} from 'lucide-react'

import { formatIDR, getUnitPrice, hasDualPricing } from '@/data/packages'
import { buildWhatsAppUrl } from '@/data/location'
import { SNAP_SCRIPT_URL, MIDTRANS_CLIENT_KEY } from '@/lib/midtrans-client'

/** Inject Snap.js once, on first use, and resolve when window.snap is ready. */
function loadSnap() {
  if (typeof window === 'undefined') return Promise.reject(new Error('no-window'))
  if (window.snap) return Promise.resolve(window.snap)

  const existing = document.querySelector('script[data-midtrans-snap]')
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener('load', () => resolve(window.snap))
      existing.addEventListener('error', () => reject(new Error('snap-load-failed')))
    })
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = SNAP_SCRIPT_URL
    script.async = true
    script.dataset.midtransSnap = 'true'
    script.setAttribute('data-client-key', MIDTRANS_CLIENT_KEY)
    script.onload = () => resolve(window.snap)
    script.onerror = () => reject(new Error('snap-load-failed'))
    document.head.appendChild(script)
  })
}

/** Today in YYYY-MM-DD, used as the date input's floor. */
function todayISO() {
  const now = new Date()
  const offset = now.getTimezoneOffset() * 60_000
  return new Date(now.getTime() - offset).toISOString().slice(0, 10)
}

export default function BookingModal({ pkg, packageName, onClose }) {
  const t = useTranslations('booking')
  const locale = useLocale()
  const dual = hasDualPricing(pkg)

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    quantity: String(Math.max(pkg.minPax, 1)),
    tourType: dual ? 'sharing' : '',
  })
  const [status, setStatus] = useState('idle') // idle|submitting|success|pending|error
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)
  const dialogRef = useRef(null)
  const firstFieldRef = useRef(null)

  // The card this modal is launched from uses a hover transform, which makes it
  // a containing block for `position: fixed` children — the dialog would be
  // trapped inside the card. Portalling to <body> escapes that.
  useEffect(() => setMounted(true), [])

  const quantity = Number(form.quantity) || 0
  const unitPrice = getUnitPrice(pkg, dual ? form.tourType : undefined) ?? 0
  const total = unitPrice * quantity

  // Escape to close + background scroll lock.
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && status !== 'submitting') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previous
    }
  }, [onClose, status])

  useEffect(() => {
    firstFieldRef.current?.focus()
  }, [])

  const update = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.date) {
      setError(t('required'))
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError(t('invalid_email'))
      return
    }
    if (form.date < todayISO()) {
      setError(t('invalid_date'))
      return
    }

    setStatus('submitting')
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: pkg.id,
          quantity,
          tourType: dual ? form.tourType : undefined,
          name: form.name,
          email: form.email,
          phone: form.phone,
          date: form.date,
          locale,
        }),
      })

      if (!res.ok) throw new Error('checkout-failed')
      const { token } = await res.json()

      const snap = await loadSnap()
      snap.pay(token, {
        onSuccess: () => setStatus('success'),
        onPending: () => setStatus('pending'),
        onError: () => {
          setStatus('error')
          setError(t('error_desc'))
        },
        // The customer dismissed the Snap popup — return them to the form.
        onClose: () => setStatus((s) => (s === 'submitting' ? 'idle' : s)),
      })
    } catch {
      setStatus('error')
      setError(t('error_desc'))
    }
  }

  const busy = status === 'submitting'
  const settled = status === 'success' || status === 'pending'

  if (!mounted) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4 backdrop-blur-sm"
      onClick={() => !busy && onClose()}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          disabled={busy}
          aria-label={t('close')}
          className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 disabled:opacity-40"
        >
          <X className="h-4 w-4" />
        </button>

        {settled ? (
          <Outcome
            status={status}
            t={t}
            onClose={onClose}
            whatsappUrl={buildWhatsAppUrl(packageName, locale)}
          />
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            <h2
              id="booking-title"
              className="font-display text-xl sm:text-2xl font-bold text-brand-navy-900 pr-10 leading-tight"
            >
              {t('modal_title', { package: packageName })}
            </h2>
            <p className="mt-2 text-sm text-slate-500">{t('modal_subtitle')}</p>

            <div className="mt-6 space-y-4">
              <Field label={t('full_name')} htmlFor="bk-name">
                <input
                  ref={firstFieldRef}
                  id="bk-name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder={t('full_name_placeholder')}
                  value={form.name}
                  onChange={update('name')}
                  className={inputClass}
                />
              </Field>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label={t('email')} htmlFor="bk-email">
                  <input
                    id="bk-email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder={t('email_placeholder')}
                    value={form.email}
                    onChange={update('email')}
                    className={inputClass}
                  />
                </Field>
                <Field label={t('phone')} htmlFor="bk-phone">
                  <input
                    id="bk-phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    placeholder={t('phone_placeholder')}
                    value={form.phone}
                    onChange={update('phone')}
                    className={inputClass}
                  />
                </Field>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label={t('date')} htmlFor="bk-date">
                  <input
                    id="bk-date"
                    type="date"
                    required
                    min={todayISO()}
                    value={form.date}
                    onChange={update('date')}
                    className={inputClass}
                  />
                </Field>
                <Field label={t('pax')} htmlFor="bk-qty">
                  <input
                    id="bk-qty"
                    type="number"
                    required
                    min={pkg.minPax}
                    max={20}
                    step={1}
                    value={form.quantity}
                    onChange={update('quantity')}
                    className={inputClass}
                  />
                </Field>
              </div>

              {dual && (
                <Field label={t('tour_type')}>
                  <div className="grid grid-cols-2 gap-3">
                    {['sharing', 'private'].map((type) => (
                      <label
                        key={type}
                        className={`cursor-pointer rounded-xl border p-3 text-center transition ${
                          form.tourType === type
                            ? 'border-brand-purple bg-brand-purple-50 text-brand-purple'
                            : 'border-slate-200 text-slate-600 hover:border-brand-purple-200'
                        }`}
                      >
                        <input
                          type="radio"
                          name="tourType"
                          value={type}
                          checked={form.tourType === type}
                          onChange={update('tourType')}
                          className="sr-only"
                        />
                        <span className="block text-sm font-semibold">
                          {t(type)}
                        </span>
                        <span className="mt-0.5 block text-xs opacity-80">
                          {formatIDR(getUnitPrice(pkg, type))}
                        </span>
                      </label>
                    ))}
                  </div>
                </Field>
              )}
            </div>

            {/* Total — the server recomputes this independently at checkout. */}
            <div className="mt-6 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                {t('total')}
              </span>
              <span className="font-display text-xl font-extrabold text-brand-purple">
                {formatIDR(total)}
              </span>
            </div>

            {error && (
              <p className="mt-4 flex items-start gap-2 text-sm text-red-600">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                {error}
              </p>
            )}

            <div className="mt-6 flex flex-col-reverse sm:flex-row gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={busy}
                className="flex-1 rounded-full border border-slate-200 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                disabled={busy || total <= 0}
                className="flex flex-[2] items-center justify-center gap-2 rounded-full bg-brand-purple py-3 text-sm font-bold text-white shadow-brand transition hover:bg-brand-purple-800 disabled:opacity-60"
              >
                {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                {busy ? t('processing') : t('submit')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  )
}

const inputClass =
  'w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-brand-navy-900 outline-none transition focus:border-brand-purple focus:ring-2 focus:ring-brand-purple-100'

function Field({ label, htmlFor, children }) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-xs font-bold uppercase tracking-[0.12em] text-slate-500"
      >
        {label}
      </label>
      {children}
    </div>
  )
}

function Outcome({ status, t, onClose, whatsappUrl }) {
  const paid = status === 'success'
  const Icon = paid ? CheckCircle2 : Clock

  return (
    <div className="p-8 text-center">
      <div
        className={`mx-auto grid h-16 w-16 place-items-center rounded-full ${
          paid ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
        }`}
      >
        <Icon className="h-8 w-8" />
      </div>
      <h2 className="mt-5 font-display text-xl font-bold text-brand-navy-900">
        {paid ? t('success_title') : t('pending_title')}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        {paid ? t('success_desc') : t('pending_desc')}
      </p>
      <div className="mt-7 flex flex-col gap-3">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-yellow w-full"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </a>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-slate-200 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          {t('close')}
        </button>
      </div>
    </div>
  )
}

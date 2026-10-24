// Package definitions — non-translatable metadata (prices, IDs, icons).
// Translatable text lives in /messages/{en,id,zh}.json under packages.p1…p4.
//
// Everything here must stay JSON-serializable: the list is resolved in a Server
// Component and handed to the client <PackageCard>, so `iconName` is a string
// that the card maps back to a lucide component (see components/PackageCard.jsx).

export const packages = [
  {
    id: 'p1',
    translationKey: 'p1',
    iconName: 'Mountain',
    iconColor: 'text-brand-purple',
    accentClass: 'from-brand-purple-600 to-brand-purple-900',
    hasItinerary: true,
    hasDuration: false,
    hasFixedTime: false,
    minPax: 2,
    popular: true,
    pricing: {
      sharing: 700000,
      private: 900000,
    },
    image: '/packages/package-1.jpg',
  },
  {
    id: 'p2',
    translationKey: 'p2',
    iconName: 'Droplets',
    iconColor: 'text-brand-navy',
    accentClass: 'from-brand-navy-700 to-brand-navy-950',
    hasItinerary: false,
    hasDuration: true,
    hasFixedTime: false,
    minPax: 1,
    popular: false,
    pricing: {
      fixed: 200000,
    },
    image: '/packages/package-2.jpg',
  },
  {
    id: 'p3',
    translationKey: 'p3',
    iconName: 'Sunrise',
    iconColor: 'text-brand-yellow-500',
    accentClass: 'from-brand-yellow-500 to-brand-yellow-600',
    hasItinerary: true,
    hasDuration: false,
    hasFixedTime: false,
    minPax: 1,
    popular: true,
    pricing: {
      fixed: 800000,
    },
    image: '/packages/package-3.jpg',
  },
  {
    id: 'p4',
    translationKey: 'p4',
    iconName: 'Truck',
    iconColor: 'text-brand-purple-600',
    accentClass: 'from-brand-purple-500 to-brand-purple-800',
    hasItinerary: true,
    hasDuration: false,
    hasFixedTime: true,
    minPax: 1,
    popular: false,
    pricing: {
      fixed: 800000,
    },
    image: '/packages/package-4.jpg',
  },
]

/** Look up a package by id. Returns undefined for unknown ids. */
export const getPackage = (id) => packages.find((p) => p.id === id)

/** True when the package is sold at two price points (sharing vs private). */
export const hasDualPricing = (pkg) =>
  Boolean(pkg?.pricing?.sharing && pkg?.pricing?.private)

/**
 * Resolve the unit price (IDR, per person) for a package and tour type.
 * `type` is 'sharing' | 'private' for dual-priced packages, ignored otherwise.
 * Returns null when the combination doesn't exist so callers can reject it —
 * this is the server's source of truth for checkout, never a client-sent amount.
 */
export const getUnitPrice = (pkg, type) => {
  if (!pkg) return null
  const { sharing, private: priv, fixed } = pkg.pricing
  if (typeof fixed === 'number') return fixed
  if (type === 'private' && typeof priv === 'number') return priv
  if (type === 'sharing' && typeof sharing === 'number') return sharing
  return null
}

/**
 * Format a number as IDR.
 * 700000 -> "Rp 700.000", or "700K" when `short` is true.
 */
export const formatIDR = (value, short = false) => {
  if (short) {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
    if (value >= 1_000) return `${Math.round(value / 1_000)}K`
    return String(value)
  }
  return `Rp ${value.toLocaleString('id-ID')}`
}

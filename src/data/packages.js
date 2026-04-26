// Package definitions - non-translatable metadata (prices, IDs, icons)
// Translatable text lives in /locales/{en,id}.json under packages.p1, p2, p3, p4

import { Mountain, Droplets, Sunrise, TruckIcon } from 'lucide-react'

export const packages = [
  {
    id: 'p1',
    translationKey: 'p1',
    icon: Mountain,
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
    // Image used in card hero
    image:
      '/packages/package-1.jpg',
  },
  {
    id: 'p2',
    translationKey: 'p2',
    icon: Droplets,
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
    image:
      '/packages/package-2.jpg',
  },
  {
    id: 'p3',
    translationKey: 'p3',
    icon: Sunrise,
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
    image:
      '/packages/package-3.jpg',
  },
  {
    id: 'p4',
    translationKey: 'p4',
    icon: TruckIcon,
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
    image:
      '/packages/package-4.jpg',
  },
]

/**
 * Format number to IDR currency string
 * 700000 -> "700K" (short) or "Rp 700.000" (full)
 */
export const formatIDR = (value, short = false) => {
  if (short) {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
    if (value >= 1_000) return `${Math.round(value / 1_000)}K`
    return String(value)
  }
  return `Rp ${value.toLocaleString('id-ID')}`
}

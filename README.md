# MOUNTAINT JEEP SUNRISE (MJS) — Website

A modern, responsive, SEO-friendly, **trilingual (EN / ID / ZH)** tour booking website for **Batur Jeep Sunrise and Tracking**, built with **Next.js (App Router) + Tailwind CSS**, with online payments via **Midtrans Snap**.

## ✨ Features

- 🌍 **Trilingual** — English, Indonesian and Simplified Chinese via `next-intl`, each on its own crawlable route (`/en`, `/id`, `/zh`) with a persistent language cookie
- ⚡ **Statically prerendered** — every locale is built to static HTML, so crawlers and users get real content instead of an empty SPA shell
- 🔍 **SEO optimized** — Next.js Metadata API (OG, Twitter, canonical, full hreflang cluster), `sitemap.xml`, `robots.txt`, and localized JSON-LD (`TravelAgency`, `TouristAttraction`, `WebSite`, `Product`/`Offer`)
- 🖼️ **Optimized imagery** — `next/image` with AVIF/WebP and responsive `sizes`; the hero drops from 5.6 MB to ~12 KB on mobile
- 💳 **Online payment** — Midtrans Snap popup with server-side price resolution and a signature-verified webhook
- ⭐ **Guest reviews** — a curated snapshot of the Google reviews, translated across all three languages with clear translation notices
- 🗺️ **Real map listing** — the embed points at the business's Google listing (CID), localized per language, and renders Google's own live rating badge
- 💬 **WhatsApp booking** — retained as the fallback, with pre-filled messages in all three languages
- 🎨 **Modern UI** — Tailwind CSS with a custom brand palette (Purple / Yellow / Dark Navy / White)
- 📱 **Fully responsive** — mobile-first layout with a proper mobile menu

## 🧰 Tech Stack

- **Next.js 16** (App Router, Turbopack) + **React 19**
- **Tailwind CSS 3**
- **next-intl 4** for routing-based i18n
- **midtrans-client** for Snap transactions and webhook verification
- **Swiper 12** (Grid + Autoplay + Pagination + Navigation + Keyboard)
- **lucide-react** for icons
- Fonts self-hosted through `next/font` (Inter + Poppins)

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.local.example .env.local
```

Then fill in your Midtrans keys (Dashboard → Settings → Access Keys) and the site URL.
Sandbox keys are prefixed `SB-`; the app derives the correct Snap host from that prefix,
so there is no separate client-side production flag.

| Variable | Scope | Purpose |
|---|---|---|
| `MIDTRANS_SERVER_KEY` | **server only** | Signs transactions, verifies webhooks |
| `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY` | public | Snap popup in the browser |
| `MIDTRANS_IS_PRODUCTION` | server only | `false` for sandbox, `true` for live |
| `NEXT_PUBLIC_SITE_URL` | public | Canonical URLs, sitemap, JSON-LD, payment redirect |

> Without a Midtrans client key the "Pay Online" button is hidden automatically and the site
> falls back to WhatsApp-only booking — so the app still works before payments are wired up.

## ⭐ Updating guest reviews

The testimonials section reads from [`data/reviews.js`](data/reviews.js), which is a **manual
snapshot** — no API key and no live calls. It records the rating, the review count, the date
it was captured, and six curated reviews with translations for all three languages.

To refresh it, open the [Google listing](https://maps.app.goo.gl/mCoNHEfivXAJH9Mr8) and:

1. Update `snapshot.rating`, `snapshot.total` and `snapshot.capturedOn`.
2. Add or swap entries in `reviews`. Each needs `author`, `rating`, `date` (`YYYY-MM`, rendered
   as a localized month so it ages honestly), and `text` for `en` / `id` / `zh`.
3. Set `nativeLocale` **only** when you are storing the reviewer's own wording in that
   language. Anything without it is labelled "translated" in every locale, so a machine
   translation is never presented as the reviewer's own words.

The map embed in the Location section shows Google's **live** rating badge, so that number
stays current even if this file drifts.

> **Deliberately not done:** the Google rating is *not* written into the site's JSON-LD as
> `aggregateRating`. Google's review-snippet guidelines require ratings collected by your own
> site and forbid aggregating them from another platform — doing it risks a manual action.
> If you ever want star snippets in search results, collect first-party reviews instead.

### 3. Run the dev server

```bash
npm run dev
```

Visit http://localhost:3000 — you'll be redirected to your best-matching locale.

### 4. Build for production

```bash
npm run build
npm start        # serve the production build locally
```

### 5. Register the payment webhook

In Midtrans Dashboard → Settings → Configuration → **Payment Notification URL**:

```
https://<your-domain>/api/midtrans/notification
```

## 📁 Project Structure

```
mountaint-jeep-sunrise/
├── next.config.js                # Images, redirects, next-intl plugin
├── proxy.js                      # Locale routing (Next 16's middleware convention)
├── jsconfig.json                 # "@/..." path alias
├── tailwind.config.js            # Brand colors, fonts, animations
├── generate_gallery.cjs          # Regenerates data/gallery.js from public/gallery
│
├── app/
│   ├── globals.css               # Tailwind + global styles + Swiper overrides
│   ├── robots.js                 # /robots.txt
│   ├── sitemap.js                # /sitemap.xml with hreflang alternates
│   ├── [locale]/
│   │   ├── layout.jsx            # Root layout: fonts, metadata, locale provider
│   │   ├── page.jsx              # Page composition + JSON-LD
│   │   └── not-found.jsx         # Localized 404
│   └── api/
│       ├── checkout/route.js             # Creates the Snap transaction
│       └── midtrans/notification/route.js # Signature-verified webhook
│
├── i18n/
│   ├── routing.js                # Locales, default, cookie, per-locale metadata
│   ├── request.js                # Loads the message dictionary per request
│   └── navigation.js             # Locale-aware Link / router
│
├── messages/
│   ├── en.json                   # English UI + package text + SEO
│   ├── id.json                   # Indonesian
│   └── zh.json                   # Simplified Chinese
│
├── lib/
│   ├── site.js                   # SITE_URL helpers
│   ├── schema.js                 # JSON-LD @graph builder
│   ├── midtrans.js               # SERVER ONLY — Snap + webhook verification
│   └── midtrans-client.js        # Browser-safe Snap constants
│
├── data/
│   ├── packages.js               # Package metadata + server-side pricing
│   ├── gallery.js                # Generated gallery manifest
│   ├── reviews.js                # Curated Google review snapshot (manual)
│   └── location.js               # Contact info, Google listing, map + WhatsApp builders
│
├── components/                   # Hero, About, PackageList, PackageCard, BookingModal,
│                                 # GalleryGrid, Testimonials, Navbar, Footer, …
├── assets/hero.svg               # Hero source art (not served)
└── public/                       # hero.jpg, og.jpg, about.jpg, gallery/, packages/, logo/
```

## 🎨 Customization

### Brand colors

Edit `tailwind.config.js` under `theme.extend.colors.brand`:

- `brand.purple` — primary (#6D28D9)
- `brand.yellow` — accent (#FACC15)
- `brand.navy` — dark (#1E3A8A)

Use classes like `bg-brand-purple`, `text-brand-yellow-400`, `border-brand-navy-900`.

### Replacing gallery images

Drop files into `public/gallery/`, then regenerate the manifest:

```bash
npm run gallery
```

Images are displayed square, so roughly 1:1 source art looks best. There's no need to
pre-resize for weight — `next/image` generates responsive AVIF/WebP variants at request time.

### Adding / editing packages

1. Edit `data/packages.js` — add metadata (`id`, `iconName`, `pricing`, `image`, `minPax`).
   `iconName` is a string mapped to a lucide icon in `components/PackageCard.jsx`.
2. Add the matching `name`, `tagline`, `inclusions` and `itinerary` under the same key in
   **all three** files in `messages/`.

Prices in `data/packages.js` are the single source of truth: the checkout API recomputes the
total from them and **ignores any amount sent by the browser**.

### Changing WhatsApp number

Edit `data/location.js`:

```js
phoneRaw: '6281228601710',     // no + or spaces, used in the WhatsApp URL
phone:    '+62 812-2860-1710', // display only
```

`buildWhatsAppUrl(packageName, locale)` and `buildEnquiryUrl(locale)` generate the message:

- **EN**: `Hello, I want to book the [Package Name]`
- **ID**: `Halo, saya ingin memesan [Nama Paket]`
- **ZH**: `您好，我想预订[套餐名称]`

### Adding a fourth language

1. Add the code to `locales` and `localeMeta` in `i18n/routing.js`.
2. Create `messages/<code>.json` with the same 118 keys.

Routing, the switcher dropdown, hreflang, the sitemap and JSON-LD all derive from that list.

### SEO metadata

All SEO copy lives under `seo.*` in each locale file. `app/[locale]/layout.jsx` turns it into
`<title>`, meta description, OG/Twitter tags, `<html lang>`, canonical and hreflang links.
Structured data is built in `lib/schema.js` and rendered from `app/[locale]/page.jsx`.
Set `NEXT_PUBLIC_SITE_URL` on deploy — everything resolves against it.

## 📦 Package Summary

| # | Package                              | Price               | Includes itinerary |
|---|--------------------------------------|---------------------|--------------------|
| 1 | Sunrise Trekking Mount Batur         | IDR 700K / 900K pp  | ✅                 |
| 2 | Batur Natural Hot Spring             | IDR 200K pp         | ❌                 |
| 3 | Sunrise & Black Lava Jeep Tour       | IDR 800K pp         | ✅                 |
| 4 | Black Lava & Black Sand Jeep Tour    | IDR 800K pp         | ✅                 |

## 📞 Contact

- **Contact Person:** Adi Parwata
- **Phone / WhatsApp:** +62 812-2860-1710
- **Address:** Jalan Raya Sekaan, Kintamani, Bangli, Bali

---

Built with 💜 in Kintamani, Bali.

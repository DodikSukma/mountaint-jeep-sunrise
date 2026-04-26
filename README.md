# Batur Sunrise Trekking (BST) — Website

A modern, responsive, SEO-friendly, bilingual (EN/ID) tour booking website for **Batur Sunrise Trekking**, built with **React + Vite + Tailwind CSS**.

## ✨ Features

- 🌍 **Bilingual** — full EN/ID support via `i18next` with a persistent language toggle
- 🔍 **SEO optimized** — dynamic meta tags, Open Graph, JSON-LD structured data via `react-helmet-async`
- 🎨 **Modern UI** — Tailwind CSS with a custom brand palette (Purple / Yellow / Dark Navy / White)
- 🖼️ **Grid gallery slider** — Swiper.js with the Grid module (2 rows × 2-4 columns responsive, autoplay)
- 📱 **Fully responsive** — mobile-first layout with a proper mobile menu
- 💬 **WhatsApp booking** — every package redirects to WhatsApp with a pre-filled bilingual message
- 🚫 **No pop-ups** — clean, distraction-free user experience

## 🧰 Tech Stack

- **React 18** + **Vite 5**
- **Tailwind CSS 3**
- **i18next** + `react-i18next` + `i18next-browser-languagedetector`
- **react-helmet-async**
- **Swiper** (with Grid + Autoplay + Pagination modules)
- **lucide-react** for icons

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the dev server

```bash
npm run dev
```

Visit `https://jeepsunrisebali.com/` — Vite will open automatically.

### 3. Build for production

```bash
npm run build
npm run preview   # preview the production build locally
```

## 📁 Project Structure

```
bst-website/
├── index.html                    # HTML entry with fonts and meta
├── package.json
├── vite.config.js
├── tailwind.config.js            # Brand colors, fonts, animations
├── postcss.config.js
├── .gitignore
├── README.md
└── src/
    ├── main.jsx                  # ReactDOM render + HelmetProvider
    ├── App.jsx                   # Page composition
    ├── index.css                 # Tailwind + global styles + Swiper overrides
    ├── i18n.js                   # i18next initialization
    │
    ├── locales/
    │   ├── en.json               # All English UI + package text
    │   └── id.json               # All Indonesian UI + package text
    │
    ├── data/
    │   ├── packages.js           # Package metadata (prices, icons, images)
    │   ├── gallery.js            # Gallery image URLs (replace with your own)
    │   └── location.js           # Contact info + WhatsApp URL builder
    │
    └── components/
        ├── SEOHead.jsx           # react-helmet-async meta tags
        ├── Navbar.jsx            # Top nav + EN/ID toggle + mobile menu
        ├── Hero.jsx              # Hero with gradient overlay + stats
        ├── About.jsx             # About section with features + image
        ├── PackageList.jsx       # Grid of 4 package cards
        ├── PackageCard.jsx       # Individual package with itinerary toggle
        ├── GalleryGrid.jsx       # Swiper grid slider (2 rows)
        ├── LocationSection.jsx   # Address + embedded Google Map
        └── Footer.jsx            # Footer with socials + contact
```

## 🎨 Customization

### Brand colors

Edit `tailwind.config.js` under `theme.extend.colors.brand`:

- `brand.purple` — primary (#6D28D9)
- `brand.yellow` — accent (#FACC15)
- `brand.navy` — dark (#1E3A8A)

Use classes like `bg-brand-purple`, `text-brand-yellow-400`, `border-brand-navy-900`.

### Replacing gallery images

Edit `src/data/gallery.js` and swap the `url` fields. Images should be roughly square (aspect-ratio-1) for best results inside the grid slider. Recommended size: **800×800 px** or larger.

### Adding / editing packages

1. Edit `src/data/packages.js` — add metadata (id, icon, pricing, image)
2. Edit `src/locales/en.json` and `src/locales/id.json` — add translated `name`, `tagline`, `inclusions`, `itinerary` under the matching `translationKey`

### Changing WhatsApp number

Edit `src/data/location.js`:

```js
phoneRaw: '6281228601710',   // no + or spaces, used in the WhatsApp URL
phone:    '+62 812-2860-1710', // display only
```

The `buildWhatsAppUrl(packageName, lang)` helper automatically generates the correct message:

- **EN**: `Hello, I want to book the [Package Name]`
- **ID**: `Halo, saya ingin memesan [Nama Paket]`

### Google Maps link

Set in `src/data/location.js` via `mapsUrl` (opens in a new tab) and `mapsEmbed` (the iframe embed).

### SEO metadata

All SEO copy lives under `seo.*` in both locale files. The `SEOHead` component automatically updates `<title>`, meta description, keywords, OG tags, `<html lang>`, and JSON-LD structured data when the language changes. On deploy, update `SITE_URL` inside `src/components/SEOHead.jsx`.

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
- **Address:** Jalan Raya Sekaan, Bayunggede, Kintamani, Bangli, Bali

---

Built with 💜 in Kintamani, Bali.

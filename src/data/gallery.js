/**
 * Gallery images for the grid slider.
 *
 * PERFORMANCE TIPS for 100+ images:
 *
 * 1. THUMBNAIL SIZE: Gallery slots render at roughly 200–400px wide on screen.
 *    Do NOT upload 3000x2000 originals. Resize thumbnails to 600x600 or 800x800.
 *    Tools: https://squoosh.app (free, web-based)
 *
 * 2. FORMAT: Use .webp instead of .jpg — 30-60% smaller with same quality.
 *    All modern browsers support it.
 *
 * 3. NAMING: Use sequential names (gallery-001.webp, gallery-002.webp, ...)
 *    so you can loop over them programmatically.
 *
 * 4. LOCATION: Put files in `public/gallery/` — served at `/gallery/...`
 */

// Auto-generated list for 100 images named gallery-001.webp through gallery-100.webp
// Replace this array with your own list if you want custom alt text per image.
export const galleryImages = Array.from({ length: 100 }, (_, i) => {
  return {
    id: i + 1,
    url: `/gallery/sunrise-${i + 1}.jpg`,
    alt: `Mount Batur gallery image ${i + 1}`,
  }
})

// DEV-ONLY placeholder generator — delete once you have real images
export const generatePlaceholders = (count = 100) =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    url: `https://picsum.photos/seed/batur-${i + 1}/600/600`,
    alt: `Placeholder ${i + 1}`,
  }))

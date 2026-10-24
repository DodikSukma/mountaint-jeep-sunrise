'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Grid, Autoplay, Pagination, Navigation, Keyboard } from 'swiper/modules'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

import 'swiper/css'
import 'swiper/css/grid'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

import { galleryImages } from '@/data/gallery'

// Thumbnails never render wider than ~20vw on desktop, so let the image
// optimizer serve small variants instead of the 12MP originals.
const THUMB_SIZES =
  '(max-width: 640px) 48vw, (max-width: 1024px) 32vw, (max-width: 1280px) 24vw, 19vw'

export default function GalleryGrid() {
  const t = useTranslations('gallery')
  const [selectedIndex, setSelectedIndex] = useState(null)
  const isOpen = selectedIndex !== null

  const closeModal = useCallback(() => setSelectedIndex(null), [])

  const handleNext = useCallback((e) => {
    if (e) e.stopPropagation()
    setSelectedIndex((prev) =>
      prev === galleryImages.length - 1 ? 0 : prev + 1
    )
  }, [])

  const handlePrev = useCallback((e) => {
    if (e) e.stopPropagation()
    setSelectedIndex((prev) =>
      prev === 0 ? galleryImages.length - 1 : prev - 1
    )
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeModal()
      if (e.key === 'ArrowRight') handleNext()
      if (e.key === 'ArrowLeft') handlePrev()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, closeModal, handleNext, handlePrev])

  // Lock background scroll while the lightbox is open.
  useEffect(() => {
    if (!isOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [isOpen])

  return (
    <section
      id="gallery"
      className="section-padding bg-white relative overflow-hidden"
    >
      {/* Decorative background */}
      <div className="absolute -top-24 right-0 h-80 w-80 rounded-full bg-brand-yellow-100/40 blur-3xl" />
      <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-brand-purple-50 blur-3xl" />

      <div className="container-custom relative">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="section-label">{t('label')}</span>
          <h2 className="section-title">{t('title')}</h2>
          <div className="mx-auto mt-2 mb-6 h-1 w-16 rounded-full bg-brand-yellow-400" />
          <p className="section-subtitle mx-auto text-center">
            {t('subtitle')}
          </p>
        </div>

        <div className="relative group">
          <Swiper
            modules={[Grid, Autoplay, Pagination, Navigation, Keyboard]}
            slidesPerView={2}
            grid={{ rows: 2, fill: 'row' }}
            spaceBetween={12}
            watchSlidesProgress
            observer
            observeParents
            /* No `loop` — with 110 slides, looping clones the whole set (2x DOM).
               `rewind` gives the same infinite feel without the duplication. */
            rewind
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
              dynamicMainBullets: 3,
            }}
            navigation={{
              prevEl: '.gallery-prev',
              nextEl: '.gallery-next',
            }}
            keyboard={{ enabled: true }}
            breakpoints={{
              640: { slidesPerView: 3, grid: { rows: 2, fill: 'row' }, spaceBetween: 14 },
              1024: { slidesPerView: 4, grid: { rows: 2, fill: 'row' }, spaceBetween: 18 },
              1280: { slidesPerView: 5, grid: { rows: 2, fill: 'row' }, spaceBetween: 20 },
            }}
            className="!pb-12"
          >
            {galleryImages.map((img, index) => (
              <SwiperSlide key={img.id} className="!h-auto">
                <button
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  aria-label={t('alt', { n: index + 1 })}
                  className="group/item relative block aspect-square w-full overflow-hidden rounded-2xl bg-slate-100 shadow-sm transition duration-500 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2"
                >
                  <Image
                    src={img.url}
                    alt={t('alt', { n: index + 1 })}
                    fill
                    sizes={THUMB_SIZES}
                    quality={70}
                    /* No `priority` here: the gallery always sits well below
                       the fold, and preloading it would compete with the hero
                       for LCP bandwidth. Native lazy loading is the right call. */
                    loading="lazy"
                    className="object-cover transition duration-500 group-hover/item:scale-[1.04]"
                  />
                  <span className="absolute inset-0 z-10 hidden place-items-center bg-black/20 transition-all group-hover/item:grid">
                    <span className="rounded-full bg-black/50 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                      {t('view')}
                    </span>
                  </span>
                </button>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation arrows — desktop only, revealed on hover */}
          <button
            className="gallery-prev hidden md:grid absolute top-1/2 -left-4 -translate-y-1/2 h-11 w-11 place-items-center rounded-full bg-white shadow-lg text-brand-purple hover:bg-brand-purple hover:text-white transition z-10 opacity-0 group-hover:opacity-100 disabled:opacity-30 disabled:pointer-events-none"
            aria-label={t('prev')}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            className="gallery-next hidden md:grid absolute top-1/2 -right-4 -translate-y-1/2 h-11 w-11 place-items-center rounded-full bg-white shadow-lg text-brand-purple hover:bg-brand-purple hover:text-white transition z-10 opacity-0 group-hover:opacity-100 disabled:opacity-30 disabled:pointer-events-none"
            aria-label={t('next')}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          {t('photo_count', { count: galleryImages.length })}
        </p>
      </div>

      {/* Lightbox */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t('title')}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 sm:p-8"
          onClick={closeModal}
        >
          <button
            className="fixed top-4 right-4 z-10 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
            onClick={closeModal}
            aria-label={t('close')}
          >
            <X className="h-6 w-6" />
          </button>

          <button
            className="fixed left-2 sm:left-4 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
            onClick={handlePrev}
            aria-label={t('prev')}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <div
            className="relative flex h-[85vh] w-[88vw] flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={galleryImages[selectedIndex].url}
              alt={t('alt', { n: selectedIndex + 1 })}
              fill
              sizes="88vw"
              quality={82}
              className="rounded-lg object-contain"
            />
            <div className="absolute -bottom-7 left-0 right-0 text-center text-sm font-medium text-slate-300">
              {selectedIndex + 1} / {galleryImages.length}
            </div>
          </div>

          <button
            className="fixed right-2 sm:right-4 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
            onClick={handleNext}
            aria-label={t('next')}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}
    </section>
  )
}

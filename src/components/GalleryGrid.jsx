import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Grid, Autoplay, Pagination, Navigation, Keyboard } from 'swiper/modules'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

import 'swiper/css'
import 'swiper/css/grid'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

import { galleryImages } from '../data/gallery'
import LazyImage from './LazyImage'

// How many images to treat as "above the fold" and load eagerly.
// Everything else waits for IntersectionObserver.
const EAGER_COUNT = 8

export default function GalleryGrid() {
  const { t } = useTranslation()
  const [selectedIndex, setSelectedIndex] = useState(null)

  const openModal = (index) => setSelectedIndex(index)
  const closeModal = () => setSelectedIndex(null)

  const handleNext = (e) => {
    if (e) e.stopPropagation()
    setSelectedIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1))
  }

  const handlePrev = (e) => {
    if (e) e.stopPropagation()
    setSelectedIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1))
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedIndex === null) return
      if (e.key === 'Escape') closeModal()
      if (e.key === 'ArrowRight') handleNext()
      if (e.key === 'ArrowLeft') handlePrev()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedIndex])

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [selectedIndex])

  return (
    <section id="gallery" className="section-padding bg-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute -top-24 right-0 h-80 w-80 rounded-full bg-brand-yellow-100/40 blur-3xl" />
      <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-brand-purple-50 blur-3xl" />

      <div className="container-custom relative">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="section-label">{t('gallery.label')}</span>
          <h2 className="section-title">{t('gallery.title')}</h2>
          <div className="mx-auto mt-2 mb-6 h-1 w-16 rounded-full bg-brand-yellow-400" />
          <p className="section-subtitle mx-auto text-center">{t('gallery.subtitle')}</p>
        </div>

        <div className="relative group">
          <Swiper
            modules={[Grid, Autoplay, Pagination, Navigation, Keyboard]}
            slidesPerView={2}
            grid={{ rows: 2, fill: 'row' }}
            spaceBetween={12}
            /* KEY PERFORMANCE SETTINGS for 100+ slides: */
            watchSlidesProgress
            observer
            observeParents
            /* Removed `loop` — with 100 slides, looping clones slides (2x DOM weight). */
            /* `rewind` gives infinite-feel navigation without the DOM duplication. */
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
              <SwiperSlide key={img.id} className="!h-auto relative group/item cursor-pointer" onClick={() => openModal(index)}>
                <div className="absolute inset-0 z-10 hidden place-items-center bg-black/20 group-hover/item:grid rounded-2xl transition-all">
                  <span className="text-white text-sm font-medium px-4 py-2 bg-black/50 rounded-full backdrop-blur-sm">View</span>
                </div>
                <LazyImage
                  src={img.url}
                  alt={img.alt}
                  aspectRatio="1/1"
                  /* First N images load immediately (they're visible on page load).
                     The rest wait for IntersectionObserver. */
                  priority={index < EAGER_COUNT}
                  className="rounded-2xl shadow-sm transition duration-500 group-hover/item:scale-[1.02] group-hover/item:shadow-md"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation arrows — hidden on mobile, shown on hover on desktop */}
          <button
            className="gallery-prev hidden md:grid absolute top-1/2 -left-4 -translate-y-1/2 h-11 w-11 place-items-center rounded-full bg-white shadow-lg text-brand-purple hover:bg-brand-purple hover:text-white transition z-10 opacity-0 group-hover:opacity-100 disabled:opacity-30 disabled:pointer-events-none"
            aria-label="Previous images"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            className="gallery-next hidden md:grid absolute top-1/2 -right-4 -translate-y-1/2 h-11 w-11 place-items-center rounded-full bg-white shadow-lg text-brand-purple hover:bg-brand-purple hover:text-white transition z-10 opacity-0 group-hover:opacity-100 disabled:opacity-30 disabled:pointer-events-none"
            aria-label="Next images"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Image count — small but helpful for a 100-image gallery */}
        <p className="mt-6 text-center text-xs text-slate-400">
          {galleryImages.length} photos · swipe, click arrows, or use ← → keys
        </p>
      </div>

      {/* Lightbox Modal */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 sm:p-8"
          onClick={closeModal}
        >
          {/* Close Button */}
          <button
            className="fixed top-4 right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20 transition disabled:opacity-50"
            onClick={closeModal}
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Previous Button */}
          <button
            className="fixed left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20 transition"
            onClick={handlePrev}
            aria-label="Previous"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Main Image */}
          <div
            className="relative flex flex-col items-center max-h-full max-w-full"
            onClick={(e) => e.stopPropagation()} /* Prevent clicks on image from closing modal */
          >
            <img
              src={galleryImages[selectedIndex].url}
              alt={galleryImages[selectedIndex].alt}
              className="max-h-[85vh] max-w-full rounded-lg object-contain shadow-2xl"
            />
            {/* Image Counter */}
            <div className="absolute -bottom-8 left-0 right-0 text-center text-sm font-medium text-slate-300">
              {selectedIndex + 1} / {galleryImages.length}
            </div>
          </div>

          {/* Next Button */}
          <button
            className="fixed right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20 transition"
            onClick={handleNext}
            aria-label="Next"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}
    </section>
  )
}

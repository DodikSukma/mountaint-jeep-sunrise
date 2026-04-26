import { useState, useEffect, useRef } from 'react'

/**
 * LazyImage — only loads the <img> when it (or its neighbors) enter the viewport.
 * Uses IntersectionObserver with a 300px rootMargin so images begin decoding
 * shortly BEFORE the user scrolls to them. Shows an animated skeleton until loaded,
 * then fades the real image in smoothly.
 *
 * Props:
 *   src            — final image URL
 *   alt            — alt text
 *   aspectRatio    — '1/1' (default), '4/3', '16/9', etc. — prevents layout shift
 *   priority       — if true, skips the observer and loads immediately (for first N images)
 *   className      — extra classes for the wrapper
 */
export default function LazyImage({
  src,
  alt = '',
  aspectRatio = '1/1',
  priority = false,
  className = '',
}) {
  const [inView, setInView] = useState(priority)
  const [loaded, setLoaded] = useState(false)
  const wrapperRef = useRef(null)

  useEffect(() => {
    if (priority || inView) return
    const el = wrapperRef.current
    if (!el) return

    // IntersectionObserver — start decoding 300px before the image is visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: '300px 0px', threshold: 0.01 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [priority, inView])

  return (
    <div
      ref={wrapperRef}
      className={`relative overflow-hidden bg-slate-100 ${className}`}
      style={{ aspectRatio }}
    >
      {/* Skeleton shimmer (visible until loaded) */}
      {!loaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 animate-pulse" />
      )}

      {/* Real image (rendered only after it enters viewport) */}
      {inView && (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchpriority={priority ? 'high' : 'low'}
          onLoad={() => setLoaded(true)}
          className={`h-full w-full object-cover transition-opacity duration-500 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  )
}

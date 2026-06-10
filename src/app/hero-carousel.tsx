'use client'

import React from 'react'
import './hero-carousel.css'



const SLIDE_INTERVAL_MS = 5000

const HERO_CAROUSEL_SLIDES = [
  { src: '/landing-2.png', alt: 'reLeafz Produktverpackung' },
  { src: '/landing-1.png', alt: 'reLeafz Cannabis Produkte' },
] as const

export function HeroImageCarousel() {
  const [activeIndex, setActiveIndex] = React.useState(0)

  React.useEffect(() => {
    if (HERO_CAROUSEL_SLIDES.length <= 1) return
    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_CAROUSEL_SLIDES.length)
    }, SLIDE_INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [])

  return (
    <aside
      className="hero-carousel"
      aria-label="Produktbilder"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="hero-carousel__frame">
        {HERO_CAROUSEL_SLIDES.map((slide, index) => (
          <img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            className={`hero-carousel__slide${index === activeIndex ? ' is-active' : ''}`}
            loading={index === 0 ? 'eager' : 'lazy'}
            decoding="async"
          />
        ))}

        {HERO_CAROUSEL_SLIDES.length > 1 && (
          <div className="hero-carousel__dots" role="tablist" aria-label="Bildauswahl">
            {HERO_CAROUSEL_SLIDES.map((slide, index) => (
              <button
                key={slide.src}
                type="button"
                role="tab"
                aria-selected={index === activeIndex}
                aria-label={`Bild ${index + 1}`}
                className={`hero-carousel__dot${index === activeIndex ? ' is-active' : ''}`}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}

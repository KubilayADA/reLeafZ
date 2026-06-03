'use client'

import React from 'react'
import './hero-carousel.css'

const HERO_CAROUSEL_SLIDES = [
  { src: '/hero/hero-desktop.png', alt: 'Medizinal Cannabis Lieferung' },
  { src: '/hero/2.png', alt: 'Cannabis Therapie Berlin' },
] as const

const SLIDE_INTERVAL_MS = 5000

function StarRow({ color }: { color: 'trustpilot' | 'google' }) {
  return (
    <span className={`hero-carousel__stars hero-carousel__stars--${color}`} aria-hidden>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className="hero-carousel__star" />
      ))}
    </span>
  )
}

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

        <div className="hero-carousel__badges">
          <div className="hero-carousel__review-card">
            <span className="hero-carousel__review-brand hero-carousel__review-brand--trustpilot">
              <span className="hero-carousel__trustpilot-icon" aria-hidden>★</span>
              Trustpilot
            </span>
            <span className="hero-carousel__review-meta">
              <span className="hero-carousel__review-count">1.263+</span>
              <span className="hero-carousel__review-score">4.9</span>
              <StarRow color="trustpilot" />
            </span>
          </div>
          <div className="hero-carousel__review-card">
            <span className="hero-carousel__review-brand hero-carousel__review-brand--google">
              <span className="hero-carousel__google-icon" aria-hidden>G</span>
              Google
            </span>
            <span className="hero-carousel__review-meta">
              <span className="hero-carousel__review-count">2.035+</span>
              <span className="hero-carousel__review-score">4.8</span>
              <StarRow color="google" />
            </span>
          </div>
        </div>

        <div className="hero-carousel__live-badge">
          <span>100+ Blüten LIVE</span>
          <span className="hero-carousel__live-dot" aria-hidden />
        </div>

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

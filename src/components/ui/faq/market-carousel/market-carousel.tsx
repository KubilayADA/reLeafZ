'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import '@/app/main.css'
import SectionParticlesBackground from '@/components/ui/SectionParticlesBackground'
import { getStrainImage } from '@/lib/strains'
import { API_BASE, type Product } from '@/lib/api'
import {
  ProductStrainCard,
  type Fulfillment,
  type ProductStrainCardData,
} from './product-strain-card'
import './market-carousel.css'

const LANDING_STRAIN_COUNT = 5

// Representative location used to query the live marketplace for the public
// landing showcase (our partner pharmacies operate in Berlin).
const SHOWCASE_CITY = 'Berlin'
const SHOWCASE_ZIP = '10115'

type ShowcaseStrain = ProductStrainCardData & { id: string }

// Shape returned by the live marketplace endpoint (mirrors src/app/marketplace).
type MarketplaceDeliveryOption = {
  method: 'BOTENDIENST_NEARBY' | 'BOTENDIENST_FAR' | 'PICKUP'
  available: boolean
}

type MarketplacePharmacy = {
  pharmacy: { id: number; name: string; zip: string; city: string }
  deliveryOptions: MarketplaceDeliveryOption[]
  products: Product[]
}

// Derive the fulfillment badge from a pharmacy's real delivery options.
function fulfillmentFromOptions(options: MarketplaceDeliveryOption[]): Fulfillment {
  const hasDelivery = options.some((o) => o.available && o.method.startsWith('BOTENDIENST'))
  const hasPickup = options.some((o) => o.available && o.method === 'PICKUP')
  if (hasDelivery && hasPickup) return 'both'
  if (hasPickup) return 'pickup'
  return 'delivery'
}

// Flatten the live marketplace response into showcase cards, keeping the real
// pharmacy name/city and delivery options from the backend.
function marketplaceToStrains(data: MarketplacePharmacy[]): ShowcaseStrain[] {
  const flowers: ShowcaseStrain[] = []
  const others: ShowcaseStrain[] = []

  for (const entry of data) {
    const pharmacy = {
      name: entry.pharmacy.name,
      city: entry.pharmacy.city,
    }
    const fulfillment = fulfillmentFromOptions(entry.deliveryOptions)

    for (const product of entry.products) {
      if (product.stock <= 0) continue
      const strain: ShowcaseStrain = {
        id: String(product.id),
        name: product.name,
        thc: product.thcPercent,
        cbd: product.cbdPercent,
        price: product.price,
        pharmacy,
        fulfillment,
        image: getStrainImage(product.name, product.imageUrl),
      }
      if (product.form === 'FLOWER') flowers.push(strain)
      else others.push(strain)
    }
  }

  return flowers.length > 0 ? flowers : others
}

function easeInOutQuart(t: number): number {
  return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2
}

const SHOWCASE_STRAINS: ShowcaseStrain[] = [
  {
    id: 'white-widow',
    name: 'White Widow',
    thc: 22,
    cbd: 1,
    price: 9.9,
    pharmacy: { name: 'Partnerapotheke', city: 'Berlin' },
    fulfillment: 'both',
    image: '/strains/white-widow-cheese.jpg',
  },
  {
    id: 'lemon-skunk',
    name: 'Lemon Skunk',
    thc: 18,
    cbd: 1,
    price: 8.4,
    pharmacy: { name: 'Partnerapotheke', city: 'Berlin' },
    fulfillment: 'delivery',
    image: '/strains/medical-saints-lemon-skunk.jpg',
  },
  {
    id: 'mac-driver',
    name: 'Mac Driver',
    thc: 24,
    cbd: 0.5,
    price: 10.5,
    pharmacy: { name: 'Partnerapotheke', city: 'Berlin' },
    fulfillment: 'both',
    image: '/strains/mac-driver.webp',
  },
  {
    id: 'slurricane',
    name: 'Slurricane',
    thc: 26,
    cbd: 0.5,
    price: 11.2,
    pharmacy: { name: 'Partnerapotheke', city: 'Berlin' },
    fulfillment: 'pickup',
    image: '/strains/slurricane.webp',
  },
  {
    id: 'hi-society',
    name: 'Hi Society',
    thc: 21,
    cbd: 1,
    price: 10.2,
    pharmacy: { name: 'Partnerapotheke', city: 'Berlin' },
    fulfillment: 'delivery',
    image: '/strains/hi-society-dfr.webp',
  },
  {
    id: 'black-cherry-punch',
    name: 'Black Cherry Punch',
    thc: 20,
    cbd: 1,
    price: 9.5,
    pharmacy: { name: 'Partnerapotheke', city: 'Berlin' },
    fulfillment: 'delivery',
    image: '/strains/black-cherry-punch.webp',
  },
  {
    id: 'granddaddy-og',
    name: 'Granddaddy OG',
    thc: 23,
    cbd: 0.5,
    price: 10.8,
    pharmacy: { name: 'Partnerapotheke', city: 'Berlin' },
    fulfillment: 'both',
    image: '/strains/madrecan-granddaddy-og.webp',
  },
  {
    id: 'mint-chocolate',
    name: 'Mint Chocolate',
    thc: 19,
    cbd: 1,
    price: 9.8,
    pharmacy: { name: 'Partnerapotheke', city: 'Berlin' },
    fulfillment: 'pickup',
    image: '/strains/organic-sweetgrass-mint-chocolate.webp',
  },
  {
    id: 'space-rider',
    name: 'Space Rider',
    thc: 25,
    cbd: 0.5,
    price: 11.5,
    pharmacy: { name: 'Partnerapotheke', city: 'Berlin' },
    fulfillment: 'both',
    image: '/strains/zoiks-space-rider.webp',
  },
]

function BoutiqueCtaCard({
  onRequest,
  revealed = false,
}: {
  onRequest: () => void
  revealed?: boolean
}) {
  return (
    <button
      type="button"
      className={`market-carousel__card mc-cta${revealed ? ' is-revealed' : ''}`}
      onClick={onRequest}
      aria-label="Jetzt anfragen und das volle Sortiment entdecken"
    >
      <div className="mc-cta__content" aria-hidden>
        <img src="/logo-1-icon.png" alt="" className="mc-cta__logo" />
        <h3 className="mc-cta__title">Entdecke das volle Sortiment</h3>
        <p className="mc-cta__text">
          Stelle deine Behandlungsanfrage und erhalte Zugang zur kompletten Boutique.
        </p>
        <span className="mc-cta__btn">
          Jetzt anfragen
          <span className="mc-cta__btn-arrow">&rarr;</span>
        </span>
      </div>
      <span className="mc-cta__veil" aria-hidden />
    </button>
  )
}

export default function MarketCarousel({
  setDialogOpen,
}: {
  setDialogOpen?: (open: boolean) => void
} = {}): React.JSX.Element {
  const sectionRef = useRef<HTMLElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const ctaRef = useRef<HTMLDivElement | null>(null)
  const animRef = useRef({ currentX: 0, targetX: 0, raf: 0 })
  const [ctaRevealed, setCtaRevealed] = useState(false)
  const [strains, setStrains] = useState<ShowcaseStrain[]>(SHOWCASE_STRAINS)

  useEffect(() => {
    let active = true
    // Pull live products straight from the marketplace backend so the showcase
    // reflects the real pharmacies, their products and delivery options.
    // TODO: swap for a dedicated best-sellers endpoint once available.
    const url = `${API_BASE}/api/marketplace?city=${encodeURIComponent(
      SHOWCASE_CITY
    )}&patientZip=${encodeURIComponent(SHOWCASE_ZIP)}`
    fetch(url, { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('Marketplace request failed'))))
      .then((json: { data?: MarketplacePharmacy[] }) => {
        if (!active) return
        const mapped = marketplaceToStrains(json.data ?? [])
        if (mapped.length === 0) return
        setStrains(mapped)
      })
      .catch(() => {
        // Keep the fallback showcase strains if the backend is unavailable.
      })
    return () => {
      active = false
    }
  }, [])

  const getMaxTranslate = useCallback(() => {
    const track = trackRef.current
    const viewport = viewportRef.current
    const cta = ctaRef.current
    if (!track || !viewport) return 0

    const naturalMax = track.scrollWidth - viewport.clientWidth
    if (!cta) return naturalMax

    const fullCtaLeft = cta.offsetLeft + cta.offsetWidth - viewport.clientWidth + 16
    return Math.min(naturalMax, Math.max(0, fullCtaLeft))
  }, [])

  const applyTransform = useCallback((x: number) => {
    const track = trackRef.current
    if (!track) return
    track.style.transform = `translate3d(${-x}px, 0, 0)`
  }, [])

  // Drive the horizontal carousel from the page's vertical scroll so scrolling
  // down progressively reveals the cards (and the CTA at the very end).
  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const anim = animRef.current

    const tick = () => {
      anim.raf = 0
      const diff = anim.targetX - anim.currentX

      if (Math.abs(diff) > 0.35) {
        anim.currentX += diff * 0.16
        applyTransform(anim.currentX)
        anim.raf = window.requestAnimationFrame(tick)
        return
      }

      if (anim.currentX !== anim.targetX) {
        anim.currentX = anim.targetX
        applyTransform(anim.currentX)
      }
    }

    const update = () => {
      const maxTranslate = getMaxTranslate()
      if (maxTranslate <= 0) {
        anim.targetX = 0
        anim.currentX = 0
        applyTransform(0)
        return
      }

      const rect = section.getBoundingClientRect()
      const vh = window.innerHeight || document.documentElement.clientHeight
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth
      const isTablet = viewportWidth >= 768 && viewportWidth < 1024
      const isMobile = viewportWidth < 768
      const startTop = vh * (isMobile ? 0.74 : isTablet ? 0.72 : 0.78)
      const endTop = vh * (isMobile ? -0.08 : isTablet ? -0.1 : -0.12)
      const span = startTop - endTop || 1
      const rawProgress = Math.min(1, Math.max(0, (startTop - rect.top) / span))
      const carouselProgress = easeInOutQuart(rawProgress)

      anim.targetX = carouselProgress * maxTranslate

      if (!anim.raf) {
        anim.raf = window.requestAnimationFrame(tick)
      }
    }

    const onScroll = () => {
      update()
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (anim.raf) window.cancelAnimationFrame(anim.raf)
      track.style.transform = ''
      anim.currentX = 0
      anim.targetX = 0
      anim.raf = 0
    }
  }, [strains, getMaxTranslate, applyTransform])

  // Unblur the CTA card once it scrolls into view inside the carousel viewport.
  useEffect(() => {
    const root = viewportRef.current
    const target = ctaRef.current
    if (!root || !target) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setCtaRevealed(entry.intersectionRatio >= 0.45)
        }
      },
      { root, threshold: [0, 0.3, 0.6, 0.9, 1] }
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [strains])

  return (
    <section
      id="sortiment"
      ref={sectionRef}
      className="market-carousel-section"
      aria-label="Medizinisches Cannabis Sortiment"
    >
      <div className="market-carousel__bg" aria-hidden>
        <div className="market-carousel__bg-base" />
        <SectionParticlesBackground className="market-carousel__particles" />
        <div className="market-carousel__glow-radial" />
        <div className="market-carousel__grid" />
      </div>

      <div className="market-carousel__shell">
        <div className="market-carousel__intro">
          <span className="market-carousel__pill">Unser Sortiment</span>
          <h2 className="market-carousel__title">
            <span className="market-carousel__title-line">Blüten aus unserer</span>
            <span className="market-carousel__title-line">Partnerapotheke.</span>
          </h2>
        </div>

        <div className="market-carousel__stage">
          <div className="market-carousel__viewport" ref={viewportRef}>
            <div
              ref={trackRef}
              className="market-carousel__track"
              role="list"
              aria-label="Cannabis Sorten Karussell"
            >
              {strains.slice(0, LANDING_STRAIN_COUNT).map((strain) => (
                <div key={strain.id} className="market-carousel__slide" role="listitem">
                  <div className="market-carousel__card">
                    <ProductStrainCard strain={strain} blurImage />
                  </div>
                </div>
              ))}
              <div ref={ctaRef} className="market-carousel__slide" role="listitem">
                <BoutiqueCtaCard onRequest={() => setDialogOpen?.(true)} revealed={ctaRevealed} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

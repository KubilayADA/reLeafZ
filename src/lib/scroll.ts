/**
 * Landing page scroll helpers. Hero ↔ main view is driven by React state in
 * `page.tsx`; we bridge non-descendant UI (header, hero) via custom events.
 */

export const RELEAFZ_GO_TO_HERO = 'releafz:go-to-hero'
export const RELEAFZ_GO_TO_ABLAUF = 'releafz:go-to-ablauf'

const HEADER_OFFSET = 70

export function scrollToLandingTop(): void {
  window.dispatchEvent(new CustomEvent(RELEAFZ_GO_TO_HERO))
}

/** Enter main view from hero, or scroll to #ablauf when already in main view. */
export function scrollLandingToAblauf(): void {
  const hero = document.querySelector('.hero-section')
  const heroBottom = hero?.getBoundingClientRect().bottom ?? 0
  const stillOnHero = heroBottom > 0

  if (stillOnHero) {
    window.dispatchEvent(new CustomEvent(RELEAFZ_GO_TO_ABLAUF))
    return
  }

  const el = document.getElementById('ablauf')
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
  }
  try {
    window.history.pushState({}, '', '/#ablauf')
  } catch {
    /* ignore */
  }
}

/** True once the fixed hero has scrolled out of view (mobile docked nav). */
export function isLandingPastHero(): boolean {
  const hero = document.querySelector('.hero-section')
  if (!hero) return true
  return hero.getBoundingClientRect().bottom <= 0
}
